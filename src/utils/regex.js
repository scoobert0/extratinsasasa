// Pattern utilities
const CC_PATTERN = {
  CARD_FORMAT: /(\d{16})\|(\d{2})\|(\d{4})\|(\d{3})/
};

const CONSULTAVEL_PATTERN = {
  FORMAT: /:(\d{4})\s*(\d{4})\s*(\d{4}):(\d{4}):(\d{4})(?:\|(\d{2})\|(\d{4})\|(\d{3}))?/,
  CARD_ONLY: /(\d{4})\s*(\d{4})\s*(\d{4}):(\d{4})/
};

const EMAIL_PATTERN = {
  FORMAT: /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)[:\s]+([^:\s]+)/
};

const PHONE_PATTERN = {
  FORMAT: /\(\+55\)\s*(\d+):([^:\s]+)/
};

const CPF_PATTERN = {
  FORMAT_6: /[:/](\d{3}[.-]\d{3}[.-]\d{3}-\d{2}):(\d{6})\b/,
  FORMAT_8: /[:/](\d{3}[.-]\d{3}[.-]\d{3}-\d{2}):(\d{8})\b/,
  FORMAT_ALPHANUM: /[:/](\d{3}[.-]\d{3}[.-]\d{3}-\d{2}):([a-zA-Z0-9]{6,})\b/
};

const GOV_DOMAINS = [
  'portal.sisp.es.gov.br',
  'picos.pi.gov.br',
  'portal.der.mg.gov.br',
  'portal.detran.go.gov.br',
  'rupe.tjmg.jus.br',
  'sgo.policiamilitar.sp.gov.br',
  'digitalizar.caixa.gov.br',
  'radar.serpro.gov.br',
  'web.sids.mg.gov.br',
  'sistemas.pm.pi.gov.br',
  'arealogada.caixaconsorcio.com.br',
  'apps.anatel.gov.br',
  'dipol.policiacivil.sp.gov.br',
  'elaudo.pcdf.df.gov.br',
  'empresa.caixaprepagos.com.br',
  'cspuweb.saude.gov.br',
  'sisregiii.saude.gov.br',
  'portalpmpe.sistemas.pm.pe.gov.br',
  'servicos.mte.gov.br',
  'portal.sesp.mt.gov.br',
  'mse.rs.gov.br',
  'deppen.pr.gov.br',
  'empresas.detran.mg.gov.br',
  'sige.seduc.ce.gov.br',
  'cremerj.org.br',
  'infopenpa.seap.pa.gov.br',
  'sgo.policiamilitar.sp.gov.br',
  'detran.sp.gov.br'
];

const CONSULTATION_DOMAINS = [
  'sisregiii.saude.gov.br',
  'si-pni.saude.gov.br',
  'confirmeonline.com.br',
  'checkok.com.br',
  'lemitti.com'
];

const GOV_PATTERN = {
  FORMAT: new RegExp(`(?:https?://)?(?:www\\.)?([^/]+)(?:/[^:]*)?:([^:\\s]+)(?::[^:\\s]+)?`, 'i')
};

const CONSULTATION_PATTERN = {
  FORMAT: new RegExp(`(?:https?://)?(?:www\\.)?([^/]+)(?:/[^:]*)?:([^:\\s]+)(?::[^:\\s]+)?`, 'i')
};

module.exports = {
  CC_PATTERN,
  CONSULTAVEL_PATTERN,
  EMAIL_PATTERN,
  PHONE_PATTERN,
  CPF_PATTERN,
  GOV_PATTERN,
  GOV_DOMAINS,
  CONSULTATION_PATTERN,
  CONSULTATION_DOMAINS
};