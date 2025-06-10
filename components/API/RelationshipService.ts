import BaseAPIService from '../../components/API/BaseAPIService';

class RelationshipService extends BaseAPIService {
    async getRelations(): Promise<any> {
        return await this.request(`/relationship`, "GET",);
    }

    async getRelationById(uuid: number): Promise<any> {
        return await this.request(`/relationship/${uuid}`, "GET");
    }

    async saveRelation(params: object): Promise<any> {
        return await this.request(`/relationship`, "POST", params);
    }

    async updateRelation(uuid: number, params: object): Promise<any> {
        return await this.request(`/relationship/${uuid}`, "PUT", params);
    }
}

export const relationService = new RelationshipService();
