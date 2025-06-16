import BaseAPIService from '../../components/API/BaseAPIService';

class AgencyMemberService extends BaseAPIService {
    async getAgencyMembers(params: object): Promise<any> {
        return await this.request(`/agency-members`, "GET", params);
    }

    async saveAgencyMember(params: object): Promise<any> {
        return await this.request(`/agency-members`, "POST", params);
    }

    async getMemberByUuid(uuid: string): Promise<any> {
        return await this.request(`/agency-members/${uuid}`, "GET");
    }

    async updateMember(uuid: string, params: object): Promise<any> {
        return await this.request(`/agency-members/${uuid}`, "PUT", params);
    }
}

export const agencyMemberService = new AgencyMemberService();