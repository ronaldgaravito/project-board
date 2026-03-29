import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserCog, UserPlus, UserMinus } from 'lucide-react';

const MembersModal = ({ members, onClose, onAddMember, onDeleteMember }) => {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAdd = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName);
      setNewMemberName('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500 rounded-xl text-white">
              <UserCog size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Gestionar Equipo</h2>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Configuración de Miembros</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <section className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Agregar Miembro</label>
            <div className="flex space-x-2">
              <div className="relative flex-grow">
                <input 
                  type="text"
                  placeholder="Nombre del nuevo miembro..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none pr-10 hover:bg-white transition-all"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">
                  <UserPlus size={18} />
                </div>
              </div>
              <button 
                onClick={handleAdd}
                className="bg-indigo-500 text-white px-5 rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
              >
                Añadir
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Miembros Actuales</label>
            <div className="space-y-3">
              <AnimatePresence>
                {members.map(member => (
                  <motion.div 
                    key={member.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-200 hover:bg-white transition-all shadow-sm"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white ${member.color}`}>
                        {member.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{member.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {member.id}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => onDeleteMember(member.id)}
                      className="p-2 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all focus:opacity-100 opacity-0 group-hover:opacity-100"
                      title="Eliminar Miembro"
                    >
                      <UserMinus size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MembersModal;
