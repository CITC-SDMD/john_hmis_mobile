import * as Yup from 'yup';

const ThemedOtherInformationForm = Yup.object().shape({
    is_remittance: Yup.boolean()
        .required("The is remittance field is required"),
    remittance: Yup.string()
        .nullable()
        .when("is_remittance", {
            is: true,
            then: (schema) => schema.required("This remittance field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    is_awarded: Yup.boolean()
        .required("The is awarded field is required"),
    awarded: Yup.string()
        .when("is_awarded", {
            is: true,
            then: schema => schema.required("This specify field is required"),
            otherwise: schema => schema.notRequired()
        }),

    applicant_signature: Yup
        .mixed()
        .required('The applicant signature field is required')

});

export default ThemedOtherInformationForm;
