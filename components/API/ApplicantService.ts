import BaseAPIService from '../../components/API/BaseAPIService';

class ApplicantService extends BaseAPIService {

    async getApplicants(params: object): Promise<any> {
        return await this.request(`/applicants`, "GET", params);
    }

    async getListApplicants(): Promise<any> {
        return await this.request(`/applicants`, "GET");
    }

    async getApplicantsSchedule(params: object): Promise<any> {
        return await this.request(`/applicants/scheduled/list`, "GET", params);
    }

    async getApproved(params: object): Promise<any> {
        return await this.request(`/applicants/approved/list`, "GET", params);
    }

    async getRejected(params: object): Promise<any> {
        return await this.request(`/applicants/rejected/list`, "GET", params);
    }

    async getApplicantsList(): Promise<any> {
        return await this.request(`/applicants`, "GET");
    }

    async saveApplicant(params: object): Promise<any> {
        return await this.request(`/applicants`, "POST", params);
    }

    async getApplicantByUuid(uuid: any): Promise<any> {
        return await this.request(`/applicants/${uuid}`, "GET");
    }

    async deleteApplicant(uuid: any): Promise<any> {
        return await this.request(`/applicants/${uuid}`, "DELETE");
    }

    async countUnScheduled(): Promise<any> {
        return await this.request(`/applicants/unscheduled/count`, "GET");
    }

    async getCurrentScheduled(): Promise<any> {
        return await this.request(`/applicants/current/appointment`, "GET");
    }

    async updateApplicant(uuid: string, params: object): Promise<any> {
        return await this.request(`/applicants/${uuid}`, "PUT", params);
    }
    
    async getApplicantAgencyMembers(): Promise<any> {
        return await this.request(`applicants-agency-members/all/list`, "GET");
    }
}

export const applicantService = new ApplicantService();