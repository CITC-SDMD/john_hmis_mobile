import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicantDocumentService extends BaseAPIService {
    async saveApplicantDocument(params: object): Promise<any> {
        return await this.request(`/applicant-documents`, "POST", params);
    }

    async getDocumentByUuid(params: object): Promise<any> {
        return await this.request(`/applicant-documents`, "GET", params);
    }
}

export const applicantDocumentService = new ApplicantDocumentService();