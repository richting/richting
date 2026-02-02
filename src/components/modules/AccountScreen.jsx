import React from 'react';
import { useStore } from '../../store/useStore';
import { User, Mail, Shield, LogOut, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const AccountScreen = () => {
    const { user, isPremium, logout, setPremium } = useStore();

    return (
        <div className="max-w-md mx-auto px-4 py-8 pb-24">
            <h2 className="text-3xl font-bold text-center mb-8">Mijn Account</h2>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6"
            >
                <div className="flex items-center space-x-4 mb-6">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                        <User size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{user?.name || 'Gebruiker'}</h3>
                        <p className="text-sm text-gray-500">{user?.email || 'email@example.com'}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                            <Shield className="text-gray-400 w-5 h-5" />
                            <span className="text-sm font-medium text-gray-700">Status</span>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${isPremium ? 'bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900' : 'bg-gray-200 text-gray-600'}`}>
                            {isPremium ? 'PREMIUM' : 'GRATIS'}
                        </span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                {!isPremium && (
                    <button
                        onClick={() => setPremium(true)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-left group"
                    >
                        <div className="flex items-center space-x-3">
                            <CreditCard className="text-blue-500 w-5 h-5" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-900">Upgrade naar Premium</span>
                                <span className="text-xs text-gray-500">Ontgrendel alle resultaten</span>
                            </div>
                        </div>
                        <span className="text-blue-600 text-sm font-bold group-hover:translate-x-1 transition-transform">€2,99</span>
                    </button>
                )}

                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 p-4 hover:bg-red-50 transition-colors text-red-500 text-left"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Uitloggen</span>
                </button>
            </motion.div>
        </div>
    );
};

export default AccountScreen;
