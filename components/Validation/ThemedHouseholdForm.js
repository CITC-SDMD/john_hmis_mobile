import * as Yup from 'yup';

const ThemedHouseholdForm = Yup.object().shape({
    firstname: Yup.string().required("The firstname field is required"),
    middlename: Yup.string().required("The middlename field is required"),
    lastname: Yup.string().required("The lastname field is required"),
    relationship_id: Yup.string().required("The relation field is required"),
    age: Yup.number().required("The age field is required").typeError("The age field is required"),
    sex: Yup.string().required("The sex field is required"),
    civil_status: Yup.string().required("The civil status field is required"),
    ethnicity: Yup.string().required("The ethnicity field is required"),
    religion: Yup.string().required("The religion field is required"),
    educational_attainment: Yup.string().required("The educational attainment field is required"),
    skills: Yup.string().required("The skills field is required"),
    occupation: Yup.string().required("The occupation field is required"),
    monthly_income: Yup.string().required("The monthly income field is required"),

    // monthly_income: Yup.number()
    //     .nullable()
    //     .typeError('Monthly income must be a number')
    //     .required('The Monthly income field is required'),
    pension_source: Yup.string().nullable(),

    other_occupation: Yup.string()
        .nullable()
        .when("occupation", {
            is: "Others",
            then: (schema) => schema.required("The other occupation field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    other_skills: Yup.string()
        .nullable()
        .when("skills", {
            is: "Others",
            then: (schema) => schema.required("The other Skills field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    other_religion: Yup.string()
        .nullable()
        .when("religion", {
            is: "Others",
            then: (schema) => schema.required("The other religion field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    monthly_pension: Yup.string()
        .nullable()
        .when('pension_source', {
            is: (val) => val && val.trim() !== '',
            then: (schema) => schema.required("The monthly pension field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

});

export default ThemedHouseholdForm;