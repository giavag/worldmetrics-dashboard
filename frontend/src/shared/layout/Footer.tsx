import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-wm-dark text-white mt-auto border-t border-slate-800">
            <div className="container mx-auto py-6 text-center text-sm text-slate-400">
                &copy; {currentYear} WorldMetrics Dashboard. All Rights Reserved.
            </div>
        </footer>
    );
};

export default Footer;