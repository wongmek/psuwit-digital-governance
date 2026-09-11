export function riskLevel(score: number) {
  if (score >= 17) return 'CRITICAL';
  if (score >= 10) return 'HIGH';
  if (score >= 5) return 'MEDIUM';
  return 'LOW';
}

export function assessRequest(input: Record<string, unknown>) {
  const classification = String(input.dataClassification || 'INTERNAL');
  const impact = ({ PUBLIC: 1, INTERNAL: 2, CONFIDENTIAL: 4, RESTRICTED: 5 } as Record<string, number>)[classification] || 2;
  let likelihood = input.externalProvider ? 3 : 2;
  if (input.containsPersonalData) likelihood += 1;
  if (String(input.type || '').includes('AI')) likelihood += 1;
  likelihood = Math.min(5, likelihood);
  const score = impact * likelihood;
  return { score, level: riskLevel(score) };
}
