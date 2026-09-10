export type Stage = '线索确认'|'需求明确'|'方案交流'|'报价/投标'|'商务推进';
export type OpportunityStatus = '进行中'|'成交'|'暂停'|'丢单';
export interface Salesperson { id:string; name:string; region:string; focus:string; phone:string; color:string; notes:string; createdAt:string; updatedAt:string; version:number }
export interface Contact { id:string; name:string; role:string; phone:string; influence:'决策人'|'影响人'|'经办人'|'未知' }
export interface Customer { id:string; name:string; industry:string; region:string; level:'重点'|'普通'|'储备'; ownerId:string; contacts:Contact[]; notes:string; verifiedAt:string; createdAt:string; updatedAt:string; version:number }
export interface Opportunity { id:string; name:string; customerId:string; ownerId:string; collaboratorIds:string[]; stage:Stage; status:OpportunityStatus; amount:number; priority:'高'|'中'|'低'; expectedClose:string; nextAction:string; nextActionDate:string; blocker:string; needsCoordination:boolean; tags:string[]; notes:string; createdAt:string; updatedAt:string; version:number }
export interface Activity { id:string; opportunityId:string; salespersonId:string; kind:'拜访'|'电话'|'方案'|'报价'|'投标'|'其他'; occurredAt:string; conclusion:string; nextAction:string; nextActionDate:string; recordedAt:string }
export interface AppData { schemaVersion:number; salespeople:Salesperson[]; customers:Customer[]; opportunities:Opportunity[]; activities:Activity[] }
