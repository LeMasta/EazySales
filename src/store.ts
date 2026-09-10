import type { AppData } from './types';

declare global { interface Window { eazySales?: { loadData:()=>Promise<AppData|null>; saveData:(data:AppData)=>Promise<boolean>; exportData:(data:AppData)=>Promise<boolean>; importData:()=>Promise<AppData|null>; checkUpdate:()=>Promise<boolean>; installUpdate:()=>Promise<void>; onUpdateStatus:(callback:(s:{type:string;detail:string})=>void)=>void } } }

export const emptyData: AppData = { schemaVersion: 1, salespeople: [], customers: [], opportunities: [], activities: [] };

export const dataStore = {
  async load(): Promise<AppData> {
    if (window.eazySales) return (await window.eazySales.loadData()) ?? emptyData;
    const raw = localStorage.getItem('eazysales-data'); return raw ? JSON.parse(raw) : emptyData;
  },
  async save(data: AppData) {
    if (window.eazySales) return window.eazySales.saveData(data);
    localStorage.setItem('eazysales-data', JSON.stringify(data)); return true;
  },
  async export(data: AppData) {
    if (window.eazySales) return window.eazySales.exportData(data);
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='EazySales-data.json'; a.click(); return true;
  },
  async import(): Promise<AppData|null> {
    if (window.eazySales) return window.eazySales.importData();
    return null;
  }
};
