import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useFormik } from "formik";
import React from "react";
import { Accordion } from "@/components/base/rawAccordion";
import { useMutation } from "@tanstack/react-query";
import { Toast } from "@/components/base/toast";
import ServiceEditorLayout from "@/features/services/layouts/ServiceEditorPageLayout";
import {useCreateServiceState} from "@/features/services/context/useCreateServiceState";
import {addQuestionFn, removeQuestionFn, updateQuestionFn} from "@/lib/endpoints/faqFns";
import AddNewCard, {AddNewCardType} from "@/features/categories/cards/addNewCard";
import {addFAQSchema} from "@/features/services/validation/addService";
import {createServicePages} from "@/features/services/constants/createServicePages";

const AddServiceFAQsPage = () => {
    const {
        serviceId,
        faqId,
        setFAQId,
        handleNext,
        handleBack,
        faqData,
    } = useCreateServiceState();

    const { mutate: createFAQMutation, isPending: isCreateFAQPending }= useMutation({
        mutationFn: addQuestionFn,
    });

    const { mutate: updateFAQMutation, isPending: isUpdateFAQPending }= useMutation({
        mutationFn: updateQuestionFn,
    });

    const { mutate: deleteFAQMutation, isPending: isDeleteFAQPending }= useMutation({
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
            if (!faqId) {
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

                    createFAQMutation(faqData,{
                        onSuccess(data, variables, context) {
                            if (!next) Toast.success("Draft saved successfully");
                            if (next) handleNext();
                        },
                        onError: (error: any) => {
                            console.log("Error",error)
                            Toast.error("Something went wrong");
                        },
                    });
                    setFAQId(faqs[0].id)

                }
            }
            else {
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

                        updateFAQMutation({
                         id:faq.id,
                         data:faqData
                        });
                    }
        }
        }catch (error) {
            console.error(error);
        }
    };

    const handleRemoveFAQ = (index: number) => {
        const newFaqs = [...formik.values.faqs];
        newFaqs.splice(index, 1);
        formik.setFieldValue("faqs", newFaqs);
    };

    const handleUpdateFAQ = (index: number, updatedFAQ: { question: string, answer: string }) => {
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
            disabled={isCreateFAQPending}
            onSubmit={formik.handleSubmit}
            steps={createServicePages}
        >
            <div className="pb-24 pt-7">
                <DragDropContext
                    onDragEnd={(result) => {
                        const { source, destination } = result;
                        if (!destination) return;

                        const reorderedFAQs = [...formik.values.faqs];
                        const [movedFAQ] = reorderedFAQs.splice(source.index, 1);
                        reorderedFAQs.splice(destination.index, 0, movedFAQ);

                        formik.setFieldValue("faqs", reorderedFAQs); // Update the Formik field
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
                                        <Draggable key={faq.id} draggableId={faq.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="faq-item bg-gray-50 p-6 rounded-lg shadow-md mb-4"
                                                >
                                                    <div className="faq-header space-y-4">
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
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                                                        />
                                                        <textarea
                                                            value={faq.answer}
                                                            onChange={(e) =>
                                                                handleUpdateFAQ(index, {
                                                                    question: faq.question,
                                                                    answer: e.target.value,
                                                                })
                                                            }
                                                            placeholder="Enter answer"
                                                            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
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
