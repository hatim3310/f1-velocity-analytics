import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    highPerformance: boolean;
    setHighPerformance: (value: boolean) => void;
    spoilerMode: boolean;
    setSpoilerMode: (value: boolean) => void;
    autoRefresh: boolean;
    setAutoRefresh: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Initialize from localStorage if available, otherwise default
    const [highPerformance, setHighPerformance] = useState(() => {
        const saved = localStorage.getItem('f1_highPerformance');
        return saved ? JSON.parse(saved) : false;
    });

    const [spoilerMode, setSpoilerMode] = useState(() => {
        const saved = localStorage.getItem('f1_spoilerMode');
        return saved ? JSON.parse(saved) : false;
    });

    const [autoRefresh, setAutoRefresh] = useState(() => {
        const saved = localStorage.getItem('f1_autoRefresh');
        return saved ? JSON.parse(saved) : false;
    });

    // Persist to localStorage
    useEffect(() => {
        localStorage.setItem('f1_highPerformance', JSON.stringify(highPerformance));
        // Toggle a global class for CSS usage
        if (highPerformance) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }, [highPerformance]);

    useEffect(() => {
        localStorage.setItem('f1_spoilerMode', JSON.stringify(spoilerMode));
    }, [spoilerMode]);

    useEffect(() => {
        localStorage.setItem('f1_autoRefresh', JSON.stringify(autoRefresh));
    }, [autoRefresh]);

    return (
        <SettingsContext.Provider value={{
            highPerformance, setHighPerformance,
            spoilerMode, setSpoilerMode,
            autoRefresh, setAutoRefresh
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
