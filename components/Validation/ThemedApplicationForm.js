// validationSchema.js
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
    storeys: Yup.string().required("The storeys type field is required"),
    is_dangerzone: Yup.boolean().oneOf([true, false], "This field is required"),
    is_davao_voter: Yup.boolean().oneOf([true, false], "This field is required"),
    civil_status: Yup.string().required("The civil status field is required"),
    is_government_project: Yup.boolean().oneOf([true, false], "This field is required"),
    married_date: Yup.date().nullable().when("civil_status", {
        is: "married",
        then: Yup.date().required("This married date field is required"),
    }),
    live_in_date: Yup.date().nullable().when("civil_status", {
        is: "live_in",
        then: Yup.date().required("This live in date field is required"),
    }),
    structure_others: Yup.string().when("structure_type", {
        is: "others",
        then: Yup.string().required("This structure other's field is required"),
    }),
    hazard: Yup.string().when("is_dangerzone", {
        is: true,
        then: Yup.string().required("This hazard field is required"),
    }),
    hazard_others: Yup.string().when("hazard", {
        is: "others",
        then: Yup.string().required("This hazard other's field is required"),
    }),
    project_type: Yup.string().nullable().when("is_government_project", {
        is: true,
        then: Yup.string().required("This project type field is required"),
    }),
    community_facility: Yup.string().when("project_type", {
        is: "Community Facilities",
        then: Yup.string().required("This community facility is required"),
    }),
    other_project_type: Yup.string().when("project_type", {
        is: "Others",
        then: Yup.string().required("This Specify project type is required"),
    }),
    not_davao_voter_place: Yup.string().when("is_davao_voter", {
        is: false,
        then: Yup.string().required("This davao voter place field is required"),
    }),
    spouse_firstname: Yup.string().when("civil_status", {
        is: (val) => val === "married" || val === "live_in",
        then: Yup.string().required("This spouse firstname type is required"),
    }),
    spouse_middlename: Yup.string().when("civil_status", {
        is: (val) => val === "married" || val === "live_in",
        then: Yup.string().required("This spouse middlename type is required"),
    }),
    spouse_lastname: Yup.string().when("civil_status", {
        is: (val) => val === "married" || val === "live_in",
        then: Yup.string().required("This spouse lastname type is required"),
    }),
    spouse_birthdate: Yup.date().nullable().when("civil_status", {
        is: (val) => val === "married" || val === "live_in",
        then: Yup.date().required("This spouse birthdate type is required"),
    }),
    year_resided: Yup.string().required("The year resided field is required"),
});

export default ThemedValidation;
