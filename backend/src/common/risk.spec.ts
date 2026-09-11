import { assessRequest, riskLevel } from './risk';
describe('risk assessment', () => {
  it('maps score to four levels', () => {
    expect([riskLevel(4),riskLevel(5),riskLevel(10),riskLevel(17)]).toEqual(['LOW','MEDIUM','HIGH','CRITICAL']);
  });
  it('raises restricted personal external AI usage to critical', () => {
    expect(assessRequest({ type:'การใช้เครื่องมือ AI', dataClassification:'RESTRICTED', containsPersonalData:true, externalProvider:'Vendor' })).toEqual({ score:25, level:'CRITICAL' });
  });
});
