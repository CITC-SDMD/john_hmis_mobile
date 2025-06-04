import * as Yup from 'yup';

const ThemedValidation = Yup.object().shape({
    barangay: Yup.string().required("The barangay field is required"),
    admin_district: Yup.string().required("The admin district field is required"),
    sex: Yup.string().required("The sex field is required"),
    present_address: Yup.string().required("The present address field is required"),
    housing_occupancy: Yup.string().required("The housing occupancy field is required"),
    lot_occupancy: Yup.string().required("The lot occupancy field is required"),
    number_of_families: Yup.string().required("The number of families field is required"),
    structure_type: Yup.string().required("The structure type field is required"),
    storeys: Yup.string().required("The storeys field is required"),
    year_resided: Yup.string().required("The year resided field is required"),
    civil_status: Yup.string().required("The civil status field is required"),
    is_dangerzone: Yup.boolean().required("This field is required"),
    is_davao_voter: Yup.boolean().required("This field is required"),
    is_government_project: Yup.boolean().required("This field is required"),

    structure_others: Yup.string()
        .nullable()
        .when("structure_type", {
            is: "others",
            then: (schema) => schema.required("This structure other's field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),


    married_date: Yup.date()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable()
        .when("civil_status", {
            is: "married",
            then: (schema) => schema.required("This married date field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    live_in_date: Yup.date()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable()
        .when("civil_status", {
            is: "live_in",
            then: (schema) => schema.required("The live in date is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    spouse_firstname: Yup.string()
        .nullable()
        .when("civil_status", {
            is: (val) => val === "married" || val === "live_in",
            then: (schema) => schema.required("The spouse firstname is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    spouse_middlename: Yup.string()
        .nullable()
        .when("civil_status", {
            is: (val) => val === "married" || val === "live_in",
            then: (schema) => schema.required("The spouse middlename is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    spouse_lastname: Yup.string()
        .nullable()
        .when("civil_status", {
            is: (val) => val === "married" || val === "live_in",
            then: (schema) => schema.required("The spouse lastname is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    spouse_birthdate: Yup.date()
        .transform((value, originalValue) =>
            originalValue === "" ? null : value
        )
        .nullable()
        .when("civil_status", {
            is: (val) => val === "married" || val === "live_in",
            then: (schema) => schema.required("The spouse birthdate is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    hazard: Yup.string()
        .nullable()
        .when("is_dangerzone", {
            is: true,
            then: (schema) => schema.required("The hazard field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    hazard_others: Yup.string()
        .nullable()
        .when("hazard", {
            is: "others",
            then: (schema) => schema.required("Specify the hazard is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    project_type: Yup.string()
        .nullable()
        .when("is_government_project", {
            is: true,
            then: (schema) => schema.required("The project type is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    community_facility: Yup.string()
        .nullable()
        .when("project_type", {
            is: "Community Facilities",
            then: (schema) => schema.required("The community facility field is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    other_project_type: Yup.string()
        .nullable()
        .when("project_type", {
            is: "Others",
            then: (schema) => schema.required("Specify the project type is required"),
            otherwise: (schema) => schema.notRequired(),
        }),

    not_davao_voter_place: Yup.string()
        .nullable()
        .when("is_davao_voter", {
            is: false,
            then: (schema) => schema.required("The non-Davao voter location is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
});

export default ThemedValidation;
