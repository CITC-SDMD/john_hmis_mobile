import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicationService extends BaseAPIService {
    async getApplicationList(): Promise<any> {
        return await this.request(`/applications`, "GET");
    }

    async getApplicationByUuid(uuid: any): Promise<any> {
        return await this.request(`/applications/${uuid}`, "GET");
    }

    async saveApplication(params: object): Promise<any> {
        return await this.request(`/applications`, "POST", params);
    }

    async saveOtherInformation(uuid: any, params: object): Promise<any> {
        return await this.request(`/applications/${uuid}/store/other-information`, "POST", params);
    }

    async updateApplication(uuid: any, params: object): Promise<any> {
        return await this.request(`/applications/${uuid}`, "PUT", params);
    }

    async deleteApplication(uuid: any): Promise<any> {
        return await this.request(`/applications/${uuid}`, "DELETE");
    }

    async updateStatus(uuid: any, params: object): Promise<any> {
        return await this.request(`/applications/${uuid}/update/status`, "PUT", params);
    }

    async updateIsGenerated(params: object): Promise<any> {
        return await this.request(`/applications/update/is-generated`, "PUT", params);
    }

    async saveRemarks(uuid: any, params: object): Promise<any> {
        return await this.request(`/applications/${uuid}/save/remarks`, "POST", params);
    }
}

export const applicationService = new ApplicationService();