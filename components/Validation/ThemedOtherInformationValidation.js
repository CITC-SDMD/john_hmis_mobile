import * as Yup from 'yup';

const ThemedOtherInformationValidation = Yup.object().shape({
    applicationForm: Yup.object().shape({
        is_remittance: Yup.boolean()
            .required("The is remittance field is required"),
        is_awarded: Yup.boolean()
            .required("The is awarded field is required"),
        remittance: Yup.string()
            .when("is_remittance", {
                is: true,
                then: schema => schema.required("This remittance field is required"),
                otherwise: schema => schema.notRequired()
            }),
        awarded: Yup.string()
            .when("is_awarded", {
                is: true,
                then: schema => schema.required("This specify field is required"),
                otherwise: schema => schema.notRequired()
            }),
    }),
    applicant_signature: Yup.string()
        .required("This signature field is required"),
});

export default ThemedOtherInformationValidation;
