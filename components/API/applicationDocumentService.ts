import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicationDocumentService extends BaseAPIService {
    async saveDocument(params: object): Promise<any> {
        return await this.request(`/applicant-documents`, "POST", params);
    }

    async getDocumentByUuid(params: object): Promise<any> {
        return await this.request(`/applicant-documents`, "GET", params);
    }

    async deleteDocument(uuid: string): Promise<any> {
        return await this.request(`/applicant-documents/${uuid}`, "DELETE");
    }

}

export const applicationDocumentService = new ApplicationDocumentService();