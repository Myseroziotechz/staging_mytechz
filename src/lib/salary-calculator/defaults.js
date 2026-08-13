/** Shared PF/ESI/gratuity constants and defaults for the salary calculator. */

export const PF_RATE = 0.12 // both employee and employer, on Basic
export const PF_WAGE_CEILING_MONTHLY = 15000 // PF is mandatorily computed on min(Basic, this) once Basic exceeds it
export const PF_CAPPED_CONTRIBUTION_MONTHLY = 1800 // 12% of the 15,000 ceiling

export const ESI_EMPLOYEE_RATE = 0.0075
export const ESI_EMPLOYER_RATE = 0.0325
export const ESI_GROSS_ELIGIBILITY_MONTHLY = 21000 // ESI applies only when monthly gross is at or below this

export const GRATUITY_RATE = 0.0481 // on Basic, standard approximation (15/26 days per year of service, expressed as a % of Basic)

export const DEFAULT_BASIC_PCT_OF_CTC = 0.40
export const HRA_PCT_METRO = 0.50 // of Basic
export const HRA_PCT_NON_METRO = 0.40 // of Basic

export const METRO_CITIES = ['Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'Bengaluru', 'Hyderabad']

export const REGIME = { NEW: 'new', OLD: 'old' }
