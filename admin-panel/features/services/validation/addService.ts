import * as Yup from "yup";

export const addCategorySchema = Yup.object().shape({
    mainCategory: Yup.string().required("Main category is required"),
    subCategory: Yup.string(),
    secondaryCategory: Yup.string(),
    educator: Yup.string().required("Educator is required"),
});