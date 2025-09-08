import * as Yup from "yup";

export const addCategorySchema = Yup.object().shape({
    mainCategory: Yup.string().required("Main category is required"),
    secondaryCategory: Yup.string(),
    provider: Yup.string().required("Provider is required"),
});

export const addServiceSchema = Yup.object().shape({
    serviceTitle: Yup.string().required("Service title is required"),
    serviceDescription: Yup.string().required("Service description is required"),
    coverImage: Yup.string().required("Cover image is required"),
    previewDescription: Yup.string().required("Preview description is required"),
    // 1st 2 learning points are required
    learningPoints: Yup.array().of(
        Yup.string().test(
            "first-element-required",
            "Learning point is required",
            (value, context) => {
                const index = Number.parseInt(
                    context.path.split("[")[1].split("]")[0],
                    10
                );
                if (index === 0 || index === 1) {
                    return !!value;
                }
                return true;
            }
        )
    ),
    pricing: Yup.number().required("Pricing is required"),
    discountOn: Yup.boolean().required("Discount on is required"),
    discount: Yup.number().when("discountOn", {
        is: true,
        // biome-ignore lint/suspicious/noThenProperty: <explanation>
        then(schema) {
            return schema.required("Discount is required").max(100, "Max 100%");
        },
        otherwise(schema) {
            return schema.notRequired();
        },
    }),
    cmePoints: Yup.number().default(0).required("CME points is required"),
    cmdId: Yup.string().nullable(),
});