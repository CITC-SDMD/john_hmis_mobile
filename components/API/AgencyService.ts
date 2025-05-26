import BaseApiService from "./BaseAPIService";

class AgencyService extends BaseApiService {
    async getAgencies(): Promise<any> {
        return await this.request(`/applicants/agency/lists`, "GET");
    }

    async getAgenciesList(): Promise<any> {
        return await this.request(`/applicants/total/agency/count`, "GET");
    }

    async getAgencyByUuid(uuid: number): Promise<any> {
        return await this.request(`/agencies/${uuid}`, "GET");
    }

    async saveAgencies(params: object): Promise<any> {
        return await this.request(`/agencies`, "POST", params);
    }

    async updateAgency(uuid: object, params: object): Promise<any> {
        return await this.request(`/agencies/${uuid}`, "PUT", params);
    }
}

export const agencyService = new AgencyService();
