
export const ENDPOINTS = [
  { label:'Site Settings (GET)', method:'GET',  path:'/api/cms/site', params:[] },
  { label:'Site Settings (PUT)', method:'PUT',  path:'/api/cms/site', params:[], sampleBody:{ siteTitle: 'New Title', brand:{logo:{src:''}, favicon:{src:''}}, defaultSeo:{description:''} } },
  { label:'Navigation Main (GET)', method:'GET',  path:'/api/cms/navigation/main', params:[] },
  { label:'Navigation Main (PUT)', method:'PUT',  path:'/api/cms/navigation/main', params:[], sampleBody:{ items:[{label:'Home',href:'/'}] } },
  { label:'Navigation Footer (GET)', method:'GET',  path:'/api/cms/navigation/footer', params:[] },
  { label:'Navigation Footer (PUT)', method:'PUT',  path:'/api/cms/navigation/footer', params:[], sampleBody:{ items:[{label:'Privacy',href:'/privacy'}] } },
  { label:'Page by slug (GET)', method:'GET',  path:'/api/cms/pages/{slug}', params:['slug'] },
  { label:'Page by slug (PUT)', method:'PUT',  path:'/api/cms/pages/{slug}', params:['slug'], sampleBody:{ seo:{title:'',description:''}, content:{body:[]} } },
  { label:'Cases List (GET)', method:'GET',  path:'/api/cms/cases', params:[] },
  { label:'Case by ID (GET)', method:'GET',  path:'/api/cms/cases/{slug}', params:['slug'] },
  { label:'Case by ID (PUT)', method:'PUT',  path:'/api/cms/cases/{slug}', params:['slug'], sampleBody:{ title:'', slug:'', summary:'', seo:{title:'',description:''} } },
] as const;

export type Endpoint = typeof ENDPOINTS[number];
