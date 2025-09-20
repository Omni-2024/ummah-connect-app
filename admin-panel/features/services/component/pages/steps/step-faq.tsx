import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useFormik } from "formik";
import React from "react";
import { Accordion } from "@/components/base/rawAccordion";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/toast";
import ServiceEditorLayout from "@/features/services/layouts/ServiceEditorPageLayout";
import { useCreateServiceState } from "@/features/services/context/useCreateServiceState";
import {
  addQuestionFn,
  removeQuestionFn,
  updateQuestionFn,
} from "@/lib/endpoints/faqFns";
import AddNewCard, {
  AddNewCardType,
} from "@/features/categories/cards/addNewCard";
import { addFAQSchema } from "@/features/services/validation/addService";
import { createServicePages } from "@/features/services/constants/createServicePages";

const AddServiceFAQsPage = () => {
  const { serviceId, faqId, setFAQId, handleNext, handleBack, faqData } =
    useCreateServiceState();

  const { mutate: createFAQMutation, isPending: isCreateFAQPending } =
    useMutation({
      mutationFn: addQuestionFn,
    });

  const { mutate: updateFAQMutation, isPending: isUpdateFAQPending } =
    useMutation({
      mutationFn: updateQuestionFn,
    });

  const { mutate: deleteFAQMutation, isPending: isDeleteFAQPending } =
    useMutation({
      mutationFn: removeQuestionFn,
    });

  const formik = useFormik({
    initialValues: {
      faqs: faqData,
    },
    validationSchema: addFAQSchema,
    onSubmit: async (values) => {
      await handleSubmit({ next: true });
    },
  });

const handleSubmit = async ({ next }: { next: boolean }) => {
  try {
    const faqs = formik.values.faqs.map((faq, index) => ({
      ...faq,
      order: index + 1,
    }));

    for (const faq of faqs) {
      const faqData = {
        serviceId,
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      };

      if (!faq.id || typeof faq.id === "number") {
        // 🔹 New FAQ (no DB id yet, or temporary id like Date.now())
        await new Promise((resolve, reject) => {
          createFAQMutation(faqData, {
            onSuccess: (data: any) => {
              // Replace temporary id with real DB id
              faq.id = data.id;
              resolve(true);
            },
            onError: (error: any) => {
              console.error("Error creating FAQ", error);
              Toast.error("Something went wrong while creating FAQ");
              reject(error);
            },
          });
        });
      } else {
        // 🔹 Existing FAQ
        await new Promise((resolve, reject) => {
          updateFAQMutation(
            { id: faq.id, data: faqData },
            {
              onSuccess: () => resolve(true),
              onError: (error) => {
                console.error("Error updating FAQ", error);
                Toast.error("Failed to update FAQ");
                reject(error);
              },
            }
          );
        });
      }
    }

    if (!next) Toast.success("Draft saved successfully");
    if (next) handleNext();
  } catch (error) {
    console.error(error);
  }
};

const handleRemoveFAQ = (index: number) => {
  const faqToRemove = formik.values.faqs[index];

  const newFaqs = formik.values.faqs
    .filter((_, i) => i !== index)
    .map((faq, idx) => ({
      ...faq,
      order: idx + 1, // ✅ recalc order after removal
    }));

  formik.setFieldValue("faqs", newFaqs);

  if (faqToRemove.id) {
    deleteFAQMutation(faqToRemove.id, {
      onSuccess: () => {
        Toast.success("FAQ deleted successfully");
      },
      onError: (error) => {
        Toast.error("Failed to delete FAQ");
        // rollback
        formik.setFieldValue("faqs", [
          ...formik.values.faqs,
          { ...faqToRemove, order: index + 1 },
        ]);
      },
    });
  }
};


  const handleUpdateFAQ = (
    index: number,
    updatedFAQ: { question: string; answer: string }
  ) => {
    const newFaqs = [...formik.values.faqs];
    newFaqs[index] = { ...newFaqs[index], ...updatedFAQ };
    formik.setFieldValue("faqs", newFaqs);
  };

  const onDraftHandle = async () => {
    await handleSubmit({ next: false });
  };

  const onBackHandle = () => {
    handleBack();
  };

  return (
    <ServiceEditorLayout
      onBack={onBackHandle}
      onDraft={onDraftHandle}
      disabled={isCreateFAQPending || isDeleteFAQPending || isUpdateFAQPending}
      onSubmit={formik.handleSubmit}
      steps={createServicePages}
    >
      <div className="pb-24 pt-7">
        {/* Page Header */}
        <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
            FAQ Manager
            </h1>
            <p className="text-sm text-gray-500">
            Add, edit, and reorder FAQs to guide effectively.
            </p>
        </div>

        <DragDropContext
          onDragEnd={(result) => {
            const { source, destination } = result;
            if (!destination) return;

            const reorderedFAQs = [...formik.values.faqs];
            const [movedFAQ] = reorderedFAQs.splice(source.index, 1);
            reorderedFAQs.splice(destination.index, 0, movedFAQ);

            formik.setFieldValue("faqs", reorderedFAQs);
          }}
        >
          <Droppable droppableId="faqs" direction="vertical">
            {(provided) => (
              <Accordion
                type="single"
                collapsible
                className="w-full gap-4 py-12 px-4"
              >
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {formik.values.faqs.map((faq, index) => (
                    <Draggable
                      key={faq.id}
                      draggableId={faq.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="faq-item relative flex items-start bg-primary-50 border border-primary-100 p-6 rounded-xl shadow-md mb-4 hover:shadow-lg transition-shadow duration-200"
                        >
                          {/* Number + Drag Handle */}
                          <div className="flex flex-col items-center mr-4 select-none">
                            <span className="text-lg font-bold text-primary-700 bg-primary-100 px-3 py-1 rounded-full shadow-md">
                              {index + 1}
                            </span>
                            <span
                              {...provided.dragHandleProps}
                              className="cursor-grab text-black mt-2 text-xl"
                            >
                              ⋮⋮
                            </span>
                          </div>

                          {/* FAQ Content */}
                          <div className="flex-1 space-y-4">
                            <input
                                type="text"
                                value={faq.question}
                                onChange={(e) =>
                                    handleUpdateFAQ(index, {
                                    question: e.target.value,
                                    answer: faq.answer,
                                    })
                                }
                                placeholder="Enter question"
                                className="w-full h-11 px-4 border border-gray-300 rounded-lg text-sm font-medium placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 transition"
                                />

                                {/* Answer Textarea */}
                                <textarea
                                value={faq.answer}
                                onChange={(e) =>
                                    handleUpdateFAQ(index, {
                                    question: faq.question,
                                    answer: e.target.value,
                                    })
                                }
                                placeholder="Enter detailed answer..."
                                className="w-full min-h-[90px] px-4 py-3 border border-gray-200 bg-gray-50 rounded-lg text-sm placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400 transition"
                                />
                            <button
                              type="button"
                              onClick={() => handleRemoveFAQ(index)}
                              className="mt-2 text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove FAQ
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              </Accordion>
            )}
          </Droppable>
        </DragDropContext>

        <AddNewCard
          name="Add New FAQ"
          type={AddNewCardType.Click}
          className="py-0 h-[70px] flex-row text-base [&>svg]:h-5 [&>svg]:w-5 mt-4"
          onClick={() => {
            formik.setFieldValue("faqs", [
              ...formik.values.faqs,
              { id: new Date().getTime(), question: "", answer: "" },
            ]);
          }}
        />

        {typeof formik.errors.faqs === "string" && (
          <div className="text-red-500 text-sm mt-2">
            {formik.errors.faqs}
          </div>
        )}
      </div>
    </ServiceEditorLayout>
  );
};

AddServiceFAQsPage.displayName = "AddServiceFAQsPage";
export default AddServiceFAQsPage;
