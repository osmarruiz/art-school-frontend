import React from 'react';
import 'moment/locale/es';
import { Transaction } from '../../types/transaction';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaCheck,
  FaRegTrashCan,
  FaAnglesDown,
  FaPlus,
  FaAnglesUp,
  FaEye,
} from 'react-icons/fa6';
import { formatCurrency } from '../../utils/formatCurrency';
import { colorVariants } from '../../types/colorVariants';
import clsx from 'clsx';
import ActionButton from './ActionButton';

interface TransactionCardProps {
  transaction: Transaction;
  color: 'violet' | 'white' | 'red' | 'orange' | 'green';
  isVisible: boolean;
  onToggle: (id: number) => void;
  onViewDetails: (id: number) => void;
  onAddReceipt: (id: number) => void;
  onFinishTransaction: (id: number) => Promise<void>;
  onRevokeTransaction: (id: number) => void;
  children: React.ReactNode;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  color,
  isVisible,
  onToggle,
  onViewDetails,
  onAddReceipt,
  onFinishTransaction,
  onRevokeTransaction,
  children,
}) => {
  const feeTypeColor = {
    enrollment: 'text-green-500',
    month: 'text-red-400',
    other: 'text-orange-400',
  }[
    transaction.fee.type === 'enrollment'
      ? 'enrollment'
      : transaction.fee.type === 'month'
      ? 'month'
      : 'other'
  ];

  return (
    <motion.div
      animate={{ scale: [0.9, 1] }}
      transition={{ duration: 0.3 }}
      className={clsx('p-4 my-2 rounded-lg w-full', colorVariants[color].bg)}
    >
      <div className="flex justify-between items-center">
        <div className={clsx(colorVariants[color].text)}>
          <div className="block sm:flex gap-2">
            <p className={`font-bold block xl:inline-flex ${feeTypeColor}`}>
              {transaction.fee.label}
            </p>
            <span>•</span>
            <p>
              {new Date(
                transaction.target_date + 'T00:00:00-06:00',
              ).toLocaleString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="block sm:flex gap-2">
            <p className="font-bold block xl:inline-flex">
              Total: {formatCurrency(transaction.total)}
            </p>
            <p className="font-bold text-orange-500">
              Saldo: {formatCurrency(transaction.balance)}
            </p>
          </div>
          <p>{transaction.remarks ? transaction.remarks : '—'}</p>
        </div>

        <div className="flex gap-2">
          <ActionButton
            icon={<FaEye size={20} />}
            onClick={() => onViewDetails(transaction.id)}
            color={color}
            title="Ver más detalles de esta transacción"
          />
          <ActionButton
            icon={<FaPlus size={20} />}
            onClick={() => onAddReceipt(transaction.id)}
            color={color}
            title="Agregar un recibo a esta transacción"
          />
          <ActionButton
            icon={
              isVisible ? <FaAnglesUp size={20} /> : <FaAnglesDown size={20} />
            }
            onClick={() => onToggle(transaction.id)}
            color={color}
            title="Listar los recibos de esta transacción"
          />
          <ActionButton
            icon={<FaCheck size={20} />}
            onClick={() => onFinishTransaction(transaction.id)}
            color={color}
            title="Finalizar transacción"
          />
          <ActionButton
            icon={<FaRegTrashCan size={20} />}
            onClick={() => onRevokeTransaction(transaction.id)}
            color={color}
            title="Revocar transacción"
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-2"
            style={{ height: '100%', width: '100%' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionCard;
