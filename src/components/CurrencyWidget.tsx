import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign } from 'lucide-react';

interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  change: number;
}

const CurrencyWidget: React.FC = () => {
  const { t } = useLanguage();
  const [rates, setRates] = useState<CurrencyRate[]>([
    { code: 'BRL', name: t('currency.brl'), rate: 5.23, change: 0.15 },
    { code: 'PYG', name: t('currency.pyg'), rate: 7250.00, change: -25.50 },
    { code: 'CAD', name: t('currency.cad'), rate: 1.34, change: 0.02 },
    { code: 'EUR', name: t('currency.eur'), rate: 0.92, change: -0.01 },
  ]);

  // Simulate rate updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prevRates => 
        prevRates.map(rate => ({
          ...rate,
          rate: rate.rate + (Math.random() - 0.5) * (rate.code === 'PYG' ? 100 : 0.1),
          change: (Math.random() - 0.5) * (rate.code === 'PYG' ? 50 : 0.05),
        }))
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="currency-widget bg-gradient-to-br from-black/30 to-white/5 border-white/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-black text-sm flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          {t('currency.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {rates.map((rate) => (
          <div key={rate.code} className="flex items-center justify-between text-xs">
            <div className="text-white/80">
              <div className="font-medium">{rate.code}</div>
            </div>
            <div className="text-right">
              <div className="text-yellow font-mono">
                {rate.code === 'PYG' 
                  ? rate.rate.toFixed(0) 
                  : rate.rate.toFixed(3)
                }
              </div>
              <div className={`flex items-center gap-1 ${
                rate.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className={`w-3 h-3 ${rate.change < 0 ? 'rotate-180' : ''}`} />
                <span>
                  {rate.change >= 0 ? '+' : ''}
                  {rate.code === 'PYG' ? rate.change.toFixed(0) : rate.change.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t border-black/20">
          <div className="text-xs text-black/60 text-center">
            Base: 1 USD
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { CurrencyWidget };
