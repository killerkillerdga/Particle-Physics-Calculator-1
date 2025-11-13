/**
 * Local Data Configuration File (data.js)
 * Exports constants, lists, and particle masses.
 */

export const CONSTANTS = {
    "e": "1.602176634e-19",
    "c": "299792458",
    "h": "6.62607015e-34",
    "R": "8.3144621",
    "G": "6.6743e-11",
    "pi": "3.14159265359",
    /*"e": "2.71828182845",*/
    "m_e": "9.1093837015e-31",
    "hbar": "1.05457e-34",
    "hbar_MeV": "6.58212e-22",
    "alpha":`${1/137.035999177}`,
    "thetaW": `${28.76*Math.PI/180}`,
    "gg": "1.214"
    
};


export const DEP_CONSTANTS = {
    /*"e2":`${CONSTANTS["e"]**2}`*/
    
    "epsilon0": `${(CONSTANTS["e"]**2)/(CONSTANTS["alpha"]*CONSTANTS["hbar"]*CONSTANTS["c"]*4*Math.PI)}`,
    
    "ge":`${Math.sqrt(4*Math.PI*CONSTANTS["alpha"])}`,
    get "gW"(){ 
        return this["ge"]/Math.sin(CONSTANTS["thetaW"]);
    },  
    get "gZ"(){ 
        return this["ge"]/(Math.sin(CONSTANTS["thetaW"])*Math.cos(CONSTANTS["thetaW"]));
    },
    
    
    
    
    
    
    
    
};    



/**
 * Particle Masses in MeV/c²
 * Accessible via m(key) in the calculator.
 */
export const MASSES = {
    // --- FUNDAMENTAL PARTICLES (Leptons and Bosons) ---
    "e": 0.511,          // Electron
    "mu": 105.66,        // Muon
    "tau": 1776.8,       // Tauon
    "nu_e": 0.0,         // Electron Neutrino (approx 0)
    "nu_mu": 0.0,        // Muon Neutrino (approx 0)
    "nu_tau": 0.0,       // Tauon Neutrino (approx 0)
    "gamma": 0.0,        // Photon
    "g": 0.0,            // Gluon
    "W": 80377.0,        // W Boson
    "Z": 91187.0,        // Z Boson
    "H": 125100.0,       // Higgs Boson
    
    // --- BARYONS (Spin 1/2 Octet & Spin 3/2 Decuplet) ---
    // Nucleons (N)
    "p": 938.27,         // Proton
    "n": 939.57,         // Neutron
    
    // Lambda (Λ)
    "Lambda0": 1115.7,   // Lambda zero
    
    // Sigma (Σ)
    "Sigma+": 1189.4,    // Sigma plus (Spin 1/2)
    "Sigma0": 1192.6,    // Sigma zero (Spin 1/2)
    "Sigma-": 1197.4,    // Sigma minus (Spin 1/2)
    
    // Xi (Ξ)
    "Xi0": 1314.9,       // Xi zero (Spin 1/2)
    "Xi-": 1321.7,       // Xi minus (Spin 1/2)
    
    // Delta (Δ) (Spin 3/2)
    "Delta_avg": 1232.0, // Delta (Average mass)
    
    // Omega (Ω)
    "Omega-": 1672.45,   // Omega minus (Spin 3/2)

    // --- CHARMED/BOTTOM BARYONS (Representative) ---
    "Lambda_c+": 2286.5,  // Lambda c plus
    "Sigma_b-": 5815.6,   // Sigma b minus

    // --- MESONS (Spin 0 Pseudoscalar & Spin 1 Vector) ---
    // Pions (π)
    "pi+": 139.57,       // Pion plus (Pseudoscalar)
    "pi-": 139.57,
    "pi0": 134.98,       // Pion zero (Pseudoscalar)
    
    // Kaons (K)
    "K+": 493.68,        // Kaon plus (Pseudoscalar)
    "K-": 493.68,
    "K0": 497.61,        // Kaon zero (Pseudoscalar)
    
    // Eta (η)
    "eta": 547.86,       // Eta (Pseudoscalar)
    "etaPrime": 957.78,  // Eta prime (Pseudoscalar)
    
    // Rho (ρ)
    "rho": 775.2,        // Rho (Vector)
    
    // Omega (ω)
    "omega_v": 782.65,   // Omega vector meson (Vector)
    "phi": 1019.46,      // Phi (Vector)
    
    // --- CHARMED/BOTTOM MESONS (Quarkonia & Heavy Flavor) ---
    "D+": 1869.6,        // D plus (Pseudoscalar)
    "D0": 1864.8,        // D zero (Pseudoscalar)
    "B0": 5279.6,        // B zero (Pseudoscalar)
    "B+": 5279.3,        // B plus (Pseudoscalar)

    // Quarkonia
    "Jpsi": 3096.9,      // J/Psi (Charmonium - Vector)
    "Upsilon": 9460.3,   // Upsilon (Bottomonium - Vector)
};

export const LIST_VARIABLES = {
    
    "Leptons": ["m(e)", "m(mu)", "m(tau)", "m(nu_e)", "m(nu_mu)", "m(nu_tau)"],
    "Nucleons": ["m(p)", "m(n)"]
};


