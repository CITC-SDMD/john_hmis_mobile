import BaseAPIService from '../../components/API/BaseAPIService';

class AgencyService extends BaseAPIService {
    async getAgencies(params: object): Promise<any> {
        return await this.request(`/applicants/agency/lists`, "GET", params);
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