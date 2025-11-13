/**
 * Main Application Logic File (app.js)
 * Handles data import, scope creation, calculation, and UI updates.
 */

// Import data from data.js
import { CONSTANTS, DEP_CONSTANTS, LIST_VARIABLES, MASSES } from './data.js';
// Import custom functions and the setter from custom_functions.js
import { customFunctions, setMassesData } from './custom_functions.js';

let parsedConstants = {};
let parsedListVariables = {};
let parsedMasses = {};

// --- Initialization and Parsing ---

function parseConstants(constantsObj) {
    return Object.fromEntries(
        Object.entries(constantsObj).map(([key, value]) => [key, parseFloat(value)])
    );
}

function parseMasses(massesObj) {
    const parsed = {};
    for (const key in massesObj) {
        parsed[key] = parseFloat(massesObj[key]);
        if (isNaN(parsed[key])) {
            console.warn(`Mass value for '${key}' is invalid.`);
        }
    }
    return parsed;
}

function parseLists(listVarsObj, constantsMap) {
    const processedLists = {};
    const massPattern = /^m\(([^)]+)\)$/; // Regex to match m(key)
    
    for (const listName in listVarsObj) {
        const itemNames = listVarsObj[listName];
        if (Array.isArray(itemNames)) {
            processedLists[listName] = itemNames.map(name => {
                
                // 1. Check if the item is a standard constant (e.g., "c")
                const constValue = constantsMap[name];
                if (typeof constValue === 'number' && !isNaN(constValue)) {
                    return constValue;
                }

                // 2. Check if the item is a mass function call (e.g., "m(p)")
                const match = name.match(massPattern);
                if (match) {
                    const particleKey = match[1]; // 'p'
                    const massValue = parsedMasses[particleKey];
                    if (typeof massValue === 'number' && !isNaN(massValue)) {
                        return massValue;
                    }
                    throw new Error(`Particle mass 'm(${particleKey})' in list '${listName}' not found or invalid.`);
                }
                
                // 3. If neither, throw an error
                throw new Error(`List item '${name}' in list '${listName}' is not a valid constant or mass key.`);
            });
        }
    }
    return processedLists;
}

// --- Execution Scope Preparation ---

function getExecutionContext(constants, lists, customFuncs, masses) {
    const customAggregates = {
        sum: (arr, func = x => x) => {
            if (!Array.isArray(arr)) throw new Error("Sum function requires a list variable.");
            return arr.reduce((acc, x) => acc + func(x), 0);
        },
        product: (arr) => {
            if (!Array.isArray(arr)) throw new Error("Product function requires a list variable.");
            return arr.reduce((acc, x) => acc * x, 1);
        },
    };

    const standardMath = {
        // Expose Math object methods globally
        Math: Math,
        sin: Math.sin, cos: Math.cos, tan: Math.tan, 
        log: Math.log, log10: Math.log10, exp: Math.exp, 
        sqrt: Math.sqrt, abs: Math.abs, pow: Math.pow,
        PI: Math.PI, E: Math.E,
    };

    return {
        ...standardMath,
        ...customAggregates,
        ...customFuncs,
        ...constants,
        ...lists,
    };
}


// --- UI Rendering ---

function renderVariables(constants, lists, customFuncs, masses) {
    const constantsListEl = document.getElementById('constants-list');
    const listsMassesEl = document.getElementById('lists-masses-display');
    const functionsListEl = document.getElementById('functions-list');
    
    // 1. Render Constants
    constantsListEl.innerHTML = '';
    for (const [key, value] of Object.entries(constants)) {
        const constantCard = document.createElement('div');
        constantCard.className = 'p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm';
        constantCard.innerHTML = `
            <p class="text-sm font-medium text-gray-900">${key}:</p>
            <code class="text-base text-secondary font-mono">${value.toPrecision(8)}</code>
        `;
        constantsListEl.appendChild(constantCard);
    }

    // 2. Render Lists and Masses
    listsMassesEl.innerHTML = '';
    
    // Lists Title
    const listTitle = document.createElement('h3');
    listTitle.className = 'text-lg font-semibold text-gray-700 mb-2';
    listTitle.textContent = 'Lists:';
    listsMassesEl.appendChild(listTitle);

    // Lists Content (Displays the calculated values in the list)
    for (const [key, values] of Object.entries(lists)) {
        const listCard = document.createElement('div');
        listCard.className = 'p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm mb-4';
        
        // Find the original string list for display clarity
        const originalList = LIST_VARIABLES[key];

        listCard.innerHTML = `
            <p class="text-sm font-medium text-gray-900 mb-2">${key} (Array of Values)</p>
            <div class="px-2">
                ${values.map((v, i) => 
                    `<code class="list-item" title="Source: ${originalList[i]}">${v.toPrecision(4)}</code>`
                ).join('')}
            </div>
        `;
        listsMassesEl.appendChild(listCard);
    }
    
    // Masses Title
    const massTitle = document.createElement('h3');
    massTitle.className = 'text-lg font-semibold text-gray-700 mt-4 mb-2';
    massTitle.textContent = 'Particle Masses (MeV/c²):';
    listsMassesEl.appendChild(massTitle);

    const massGrid = document.createElement('div');
    massGrid.className = 'grid grid-cols-2 gap-2';
    
    const massKeys = Object.keys(masses).sort();
    const keysToDisplay = massKeys.slice(0, massKeys.length); //replace massKeys.length by 10 to display only 10

    keysToDisplay.forEach(key => {
         const massEntry = document.createElement('div');
         massEntry.className = 'p-2 bg-indigo-50 rounded-md border border-indigo-200 text-sm';
         massEntry.innerHTML = `
             <span class="font-medium text-indigo-700">m(${key}):</span>
             <code class="font-mono text-xs text-gray-600">${masses[key].toPrecision(4)}</code>
         `;
         massGrid.appendChild(massEntry);
    });
    
    /**
    if (massKeys.length > 10) {
         const more = document.createElement('p');
         more.className = 'text-xs text-gray-500 mt-2 col-span-2';
         more.textContent = `... and ${massKeys.length - 10} more. Use m(key) for lookup.`;
         massGrid.appendChild(more);
    }
    */
    
    listsMassesEl.appendChild(massGrid);


    // 3. Render Custom Functions
    functionsListEl.innerHTML = '';
    for (const [key, func] of Object.entries(customFuncs)) {
         const funcCard = document.createElement('div');
        funcCard.className = 'p-2 bg-indigo-50 rounded-lg border border-indigo-200 shadow-sm';
        // Attempt to extract arguments for display
        const argsMatch = func.toString().match(/\((.*?)\)/);
        const args = argsMatch ? argsMatch[1].replace(/\s*,\s*/g, ', ') : '';
        funcCard.innerHTML = `
            <p class="text-sm font-medium text-indigo-700">${key}(<span class="font-mono text-xs text-indigo-500">${args}</span>)</p>
        `;
        functionsListEl.appendChild(funcCard);
    }
}

// --- Core Calculation Logic ---

function calculate() {
    const inputElement = document.getElementById('expression-input');
    const resultElement = document.getElementById('result-value');
    const expression = inputElement.value;

    if (!expression.trim()) {
        resultElement.textContent = '0';
        return;
    }

    try {
        const context = getExecutionContext(parsedConstants, parsedListVariables, customFunctions, parsedMasses);
        // Replace ^ with ** for standard JavaScript power operation
        const preparedExpression = expression.trim().replace(/\^/g, '**');

        const argNames = Object.keys(context);
        const argValues = Object.values(context);
        
        // Use the Function constructor for safe, dynamic evaluation
        const func = new Function(...argNames, `return ${preparedExpression};`);
        
        const result = func(...argValues);

        if (typeof result !== 'number' || isNaN(result) || result === Infinity || result === -Infinity) {
            throw new Error("Invalid result or undefined expression outcome. Check syntax.");
        }

        resultElement.textContent = result.toPrecision(10); 
        inputElement.classList.remove('border-red-500', 'border-2');
        
    } catch (e) {
        console.error("Calculation Error:", e);
        resultElement.textContent = 'Error';
        inputElement.classList.add('border-red-500', 'border-2');
    }
}

// Allows calculation on Enter key press
function handleKey(event) {
    if (event.key === 'Enter') {
        calculate();
        event.preventDefault();
    }
}

// --- Application Setup (Runs on load) ---

function init() {
    try {
        // 1. Parse and validate all data
        parsedConstants = parseConstants({ ...CONSTANTS, ...DEP_CONSTANTS});
        parsedMasses = parseMasses(MASSES);
        // Lists depend on valid constants AND masses
        parsedListVariables = parseLists(LIST_VARIABLES, parsedConstants);

        // 2. Provide masses data to the custom_functions module for the m() lookup
        setMassesData(parsedMasses);

        // 3. Render UI
        renderVariables(parsedConstants, parsedListVariables, customFunctions, parsedMasses);

        // 4. Expose functions globally for the HTML event handlers (onclick, onkeydown)
        window.app = {
            calculate: calculate
        };
        window.handleKey = handleKey;

        // 5. Set an initial expression
        document.getElementById('expression-input').value = ''; // Test the new list!
        calculate();

    } catch (e) {
        console.error("Application Initialization Error:", e);
        // Fallback state if initialization fails
        document.getElementById('result-value').textContent = 'INIT ERROR';
    }
}

window.onload = init;
