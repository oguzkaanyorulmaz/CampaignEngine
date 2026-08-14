import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import type { Campaign, CreateCampaignRequest } from '../../core/types/api.types';

interface CampaignFormProps {
  editCampaign?: Campaign | null;
  onSubmit: (data: CreateCampaignRequest, campaignId?: number) => void;
  onCancel: () => void;
}

export default function CampaignForm({ editCampaign, onSubmit, onCancel }: CampaignFormProps) {
  // Temel Bilgiler
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [benefitDescription, setBenefitDescription] = useState('');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  });

  // Kural & Hedefleme Ekranı (Kişiselleştirme Şartları)
  const [cardTypeCondition, setCardTypeCondition] = useState('Credit'); // 'All', 'Credit', 'Debit'
  const [category, setCategory] = useState('ECommerce'); // 'All', 'ECommerce', 'Fuel', 'Restaurant', 'Market', 'Travel', 'Entertainment'
  const [lookbackMonths, setLookbackMonths] = useState(1); // 1, 3, 6
  const [minTransactionCount, setMinTransactionCount] = useState(5); // 0, 1, 3, 5, 10
  const [targetingType, setTargetingType] = useState('All'); // 'All', 'SpecificCards', 'CustomerSegment'
  const [cardBINs, setCardBINs] = useState('');
  const [customerIds, setCustomerIds] = useState('');

  // İndirim & Kazanım Ekranı (Fayda & Kullanım Şartları)
  const [benefitType, setBenefitType] = useState('Discount'); // 'Discount', 'Cashback', 'Points', 'Installment'
  const [discountPercent, setDiscountPercent] = useState(20);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState(150);
  const [minSpendAmount, setMinSpendAmount] = useState(200);

  useEffect(() => {
    if (editCampaign) {
      setTitle(editCampaign.title);
      setDescription(editCampaign.description);
      setBenefitDescription(editCampaign.benefitDescription);
      setStartDate(editCampaign.startDate.split('T')[0]);
      setEndDate(editCampaign.endDate.split('T')[0]);
      setDiscountPercent(editCampaign.discountPercent);
      setMinSpendAmount(editCampaign.minSpendAmount);
      setMaxDiscountAmount(editCampaign.maxDiscountAmount);
      setCategory(editCampaign.category || 'All');
      setMinTransactionCount(editCampaign.minTransactionCount || 0);
      setLookbackMonths(editCampaign.lookbackMonths || 1);
      setCardTypeCondition(editCampaign.cardTypeCondition || 'All');
      setBenefitType(editCampaign.benefitType || 'Discount');
      setTargetingType(editCampaign.targetingType || 'All');
      setCardBINs(editCampaign.cardBINs || '');
      setCustomerIds(editCampaign.customerIds || '');
    } else {
      // Varsayılan Akıllı Şablon: Son 1 ayda kredi kartı ile 5 E-Ticaret alışverişi
      setTitle('%20 E-Ticaret İndirimi Kampanyası');
      setDescription('Son 1 ay içinde kredi kartı ile en az 5 e-ticaret alışverişi yapmış müşterilerimize özel indirim fırsatı.');
      setBenefitDescription('%20 İndirim (150 TL\'ye kadar)');
    }
  }, [editCampaign]);

  // Otomatik Kazanım Rozeti Üretimi
  useEffect(() => {
    if (!editCampaign) {
      if (benefitType === 'Discount') {
        setBenefitDescription(`%${discountPercent} İndirim (${maxDiscountAmount} TL'ye kadar)`);
      } else if (benefitType === 'Cashback') {
        setBenefitDescription(`${maxDiscountAmount} TL Nakit İade (CashBack)`);
      } else if (benefitType === 'Points') {
        setBenefitDescription(`3x Ekstra Puan Kazanımı`);
      } else if (benefitType === 'Installment') {
        setBenefitDescription(`+3 Faizsiz Taksit İmkânı`);
      }
    }
  }, [benefitType, discountPercent, maxDiscountAmount, editCampaign]);

  const categoryLabels: Record<string, string> = {
    All: 'Tüm Sektörler',
    ECommerce: 'E-Ticaret & Sanal POS',
    Fuel: 'Akaryakıt İstasyonları',
    Restaurant: 'Restoran & Yeme-İçme',
    Market: 'Süpermarket & Gıda',
    Travel: 'Seyahat & Ulaşım',
    Entertainment: 'Kültür & Eğlence',
  };

  const getRuleSummaryText = () => {
    const cardText = cardTypeCondition === 'Credit' ? 'kredi kartı ile' : cardTypeCondition === 'Debit' ? 'banka kartı ile' : 'kartlarıyla';
    const catText = categoryLabels[category] || category;
    if (minTransactionCount > 0) {
      return `Son ${lookbackMonths} ay içinde ${cardText} en az ${minTransactionCount} adet ${catText} alışverişi yapan müşteriler`;
    }
    return `${catText} harcaması bulunan tüm müşteriler`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const data: CreateCampaignRequest = {
      title,
      description,
      benefitDescription,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      discountPercent,
      minSpendAmount,
      maxDiscountAmount,
      category,
      minTransactionCount,
      lookbackMonths,
      cardTypeCondition,
      benefitType,
      targetingType,
      cardBINs: cardBINs || undefined,
      customerIds: customerIds || undefined,
    };
    onSubmit(data, editCampaign?.campaignId);
  };

  return (
    <div className="form-builder-wrapper">
      <div className="page-header" style={{ marginBottom: '20px' }}>
        <h1>{editCampaign ? '✏️ Kampanyayı Düzenle' : '➕ Yeni Kampanya & Kural Oluşturucu'}</h1>
        <p>Hedef kitle kurallarını, indirim şartlarını ve kampanya detaylarını yapılandırın.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-builder-grid">
          {/* ═══════ SOL / ORTA ANA FORM PANELİ ═══════ */}
          <div className="form-main-pane">

            {/* 1. KURAL EKRANI (HEDEF KİTLE & KİŞİSELLEŞTİRME ŞARTLARI) */}
            <div className="form-card highlight-card">
              <div className="card-badge-header">
                <span className="step-num">1</span>
                <div>
                  <h3>🎯 Kural & Hedefleme Ekranı (Kişiselleştirme Şartları)</h3>
                  <p className="card-subtext">Bu kampanya hangi şartları sağlayan müşterilere sunulacak?</p>
                </div>
              </div>

              {/* Kart Tipi Şartı */}
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Gerekli Kart Türü Şartı</label>
                <div className="radio-pill-group">
                  <button
                    type="button"
                    className={`radio-pill ${cardTypeCondition === 'Credit' ? 'active' : ''}`}
                    onClick={() => setCardTypeCondition('Credit')}
                  >
                    💳 Yalnızca Kredi Kartı Sahipleri
                  </button>
                  <button
                    type="button"
                    className={`radio-pill ${cardTypeCondition === 'Debit' ? 'active' : ''}`}
                    onClick={() => setCardTypeCondition('Debit')}
                  >
                    🏦 Yalnızca Banka Kartı Sahipleri
                  </button>
                  <button
                    type="button"
                    className={`radio-pill ${cardTypeCondition === 'All' ? 'active' : ''}`}
                    onClick={() => setCardTypeCondition('All')}
                  >
                    🌐 Tüm Kart Tipleri
                  </button>
                </div>
              </div>

              {/* Harcama Sektörü & Zaman Aralığı */}
              <div className="form-row" style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label>Harcama Sektörü / Kategori Şartı</label>
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option value="ECommerce">🛒 E-Ticaret & Sanal POS</option>
                    <option value="Fuel">⛽ Akaryakıt İstasyonları</option>
                    <option value="Restaurant">🍽️ Restoran & Yeme-İçme</option>
                    <option value="Market">🛍️ Süpermarket & Gıda</option>
                    <option value="Travel">✈️ Seyahat & Ulaşım</option>
                    <option value="Entertainment">🎭 Kültür & Eğlence</option>
                    <option value="All">🌐 Tüm Harcamalar / Genel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>İnceleme Periyodu (Zaman Şartı)</label>
                  <select value={lookbackMonths} onChange={e => setLookbackMonths(Number(e.target.value))}>
                    <option value={1}>⏱️ Son 1 Ay İçindeki Harcamalar</option>
                    <option value={3}>⏱️ Son 3 Ay İçindeki Harcamalar</option>
                    <option value={6}>⏱️ Son 6 Ay İçindeki Harcamalar</option>
                  </select>
                </div>
              </div>

              {/* İşlem Adedi Şartı */}
              <div className="form-row">
                <div className="form-group">
                  <label>Gereken Minimum İşlem Adedi Şartı</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[0, 1, 3, 5, 10].map(cnt => (
                      <button
                        key={cnt}
                        type="button"
                        className={`chip-btn ${minTransactionCount === cnt ? 'active' : ''}`}
                        onClick={() => setMinTransactionCount(cnt)}
                      >
                        {cnt === 0 ? 'Adet Şartı Yok' : `${cnt}+ İşlem`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Kitle Kapsamı</label>
                  <select value={targetingType} onChange={e => setTargetingType(e.target.value)}>
                    <option value="All">Her Müşteriye Açık (Şartı Sağlayanlar)</option>
                    <option value="SpecificCards">Spesifik Kart BIN Grupları</option>
                    <option value="CustomerSegment">Özel Müşteri ID Listesi</option>
                  </select>
                </div>
              </div>

              {targetingType === 'SpecificCards' && (
                <div className="form-group">
                  <label>Kart BIN Numaraları (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={cardBINs}
                    onChange={e => setCardBINs(e.target.value)}
                    placeholder="Örn: 552000, 400000, 411111"
                  />
                </div>
              )}

              {targetingType === 'CustomerSegment' && (
                <div className="form-group">
                  <label>Hedef Müşteri ID Listesi (virgülle ayırın)</label>
                  <input
                    type="text"
                    value={customerIds}
                    onChange={e => setCustomerIds(e.target.value)}
                    placeholder="Örn: 1, 1002, 1003"
                  />
                </div>
              )}

              {/* Canlı Kural Özeti Kutusu */}
              <div className="rule-preview-badge">
                <span style={{ fontSize: '18px' }}>⚡</span>
                <div>
                  <strong>Tanımlanan Kural:</strong> {getRuleSummaryText()}
                </div>
              </div>
            </div>

            {/* 2. İNDİRİM & KAZANIM EKRANI */}
            <div className="form-card highlight-card">
              <div className="card-badge-header">
                <span className="step-num gold">2</span>
                <div>
                  <h3>💰 İndirim & Kazanım Ekranı (Fayda & Kullanım Şartları)</h3>
                  <p className="card-subtext">Hak eden müşteriye verilecek indirim oranı ve kullanım limitleri</p>
                </div>
              </div>

              {/* Kazanım Türü */}
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Kazanım Türü</label>
                <div className="radio-pill-group">
                  <button
                    type="button"
                    className={`radio-pill ${benefitType === 'Discount' ? 'active' : ''}`}
                    onClick={() => setBenefitType('Discount')}
                  >
                    🏷️ Yüzdesel İndirim (%)
                  </button>
                  <button
                    type="button"
                    className={`radio-pill ${benefitType === 'Cashback' ? 'active' : ''}`}
                    onClick={() => setBenefitType('Cashback')}
                  >
                    💵 Sabit Nakit İade (₺)
                  </button>
                  <button
                    type="button"
                    className={`radio-pill ${benefitType === 'Points' ? 'active' : ''}`}
                    onClick={() => setBenefitType('Points')}
                  >
                    ⭐ Ekstra Puan / Mil
                  </button>
                  <button
                    type="button"
                    className={`radio-pill ${benefitType === 'Installment' ? 'active' : ''}`}
                    onClick={() => setBenefitType('Installment')}
                  >
                    📅 Faizsiz Ek Taksit
                  </button>
                </div>
              </div>

              {/* İndirim Yüzdesi Slider */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Hak Eden Kişiye Verilecek İndirim Oranı</label>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#111' }}>%{discountPercent}</span>
                </div>
                <div className="slider-group">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={discountPercent}
                    onChange={e => setDiscountPercent(Number(e.target.value))}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                    <span>%1</span>
                    <span>%10</span>
                    <span>%20</span>
                    <span>%30</span>
                    <span>%50</span>
                    <span>%100</span>
                  </div>
                </div>
              </div>

              {/* Sınır & Min Harcama Tutarı */}
              <div className="form-row">
                <div className="form-group">
                  <label>Maksimum İndirim Sınırı (₺ Üst Limit)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      value={maxDiscountAmount}
                      onChange={e => setMaxDiscountAmount(Number(e.target.value))}
                      placeholder="150"
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>TL Sınır</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Kullanım İçin Gerekli Min. Harcama (₺)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      value={minSpendAmount}
                      onChange={e => setMinSpendAmount(Number(e.target.value))}
                      placeholder="200"
                    />
                    <span style={{ position: 'absolute', right: '12px', top: '12px', fontSize: '12px', fontWeight: 700, color: '#94A3B8' }}>TL ve Üzeri</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. GENEL BİLGİLER & GEÇERLİLİK */}
            <div className="form-card">
              <div className="card-badge-header">
                <span className="step-num" style={{ background: '#E2E8F0', color: '#475569' }}>3</span>
                <div>
                  <h3>📝 Genel Bilgiler & Yayın Tarihleri</h3>
                  <p className="card-subtext">Kampanyanın başlık, açıklama ve geçerlilik süresi</p>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Kampanya Başlığı</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Örn: %20 E-Ticaret İndirimi Kampanyası"
                  required
                />
              </div>

              <div className="form-group">
                <label>Kampanya Açıklaması</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Kampanya detay açıklaması..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Kazanım Sloganı / Rozet Metni</label>
                <input
                  type="text"
                  value={benefitDescription}
                  onChange={e => setBenefitDescription(e.target.value)}
                  placeholder="Örn: %20 İndirim (150 TL'ye kadar)"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Başlangıç Tarihi</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Form Aksiyon Butonları */}
            <div className="form-actions" style={{ marginTop: '16px' }}>
              <button type="button" className="btn-outline" onClick={onCancel}>
                İptal Et
              </button>
              <button type="submit" className="btn-black" style={{ padding: '14px 36px', fontSize: '14px' }}>
                {editCampaign ? '💾 Kampanyayı Güncelle' : '🚀 Kampanyayı Canlıya Yayınla'}
              </button>
            </div>

          </div>

          {/* ═══════ SAĞ KOLON (CANLI MÜŞTERİ ÖNİZLEMESİ & KURAL ÖZETİ) ═══════ */}
          <div className="form-preview-pane">
            <div className="preview-sticky-card">
              <div className="preview-header">
                <span style={{ fontSize: '14px' }}>👁️</span>
                <h4>Canlı Müşteri Ekranı Önizlemesi</h4>
              </div>
              <p className="preview-desc">
                Bu kampanya yayınlandığında, şartları sağlayan müşterilerin <strong>localhost:2000</strong> ekranında aşağıdaki gibi görünecektir:
              </p>

              {/* 1:1 Birebir Müşteri Kartı Simülasyonu */}
              <div className="simulated-campaign-widget">
                <div className="sim-banner">
                  <svg width="150" height="110" viewBox="0 0 200 150" fill="none">
                    <rect x="25" y="15" width="140" height="90" rx="12" fill="#FDE047" transform="rotate(-8 95 60)" />
                    <path d="M95 10 L95 2M90 6 L100 6M120 18 L126 12M70 18 L64 12" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
                    <rect x="35" y="45" width="145" height="92" rx="12" fill="#6366F1" />
                    <rect x="52" y="62" width="28" height="22" rx="4" fill="#FDE047" />
                    <circle cx="145" cy="115" r="10" fill="#EF4444" opacity="0.9" />
                    <circle cx="132" cy="115" r="10" fill="#F59E0B" opacity="0.9" />
                  </svg>
                </div>

                <div className="sim-body">
                  <div className="sim-tag">Size Özel Aktif Kampanya</div>
                  <div className="sim-title">{title || 'Kampanya Başlığı'}</div>

                  {benefitDescription && (
                    <div className="sim-benefit">🎁 {benefitDescription}</div>
                  )}

                  <p className="sim-desc">{description || 'Kampanya açıklaması...'}</p>

                  <div className="sim-reason">
                    📊 <strong>Analiz Özeti:</strong> {getRuleSummaryText()} şartını sağladığınız için özel tanımlandı
                  </div>

                  <button type="button" className="sim-btn">
                    Kampanyaya Katıl
                  </button>
                </div>
              </div>

              {/* Kural Kontrol Özeti */}
              <div className="preview-rule-checklist">
                <h5>📋 Kural Kontrol Parametreleri</h5>
                <ul>
                  <li>
                    <span>Hedef Kart:</span>
                    <strong>{cardTypeCondition === 'Credit' ? 'Kredi Kartı' : cardTypeCondition === 'Debit' ? 'Banka Kartı' : 'Tümü'}</strong>
                  </li>
                  <li>
                    <span>Sektör Kısıtı:</span>
                    <strong>{categoryLabels[category]}</strong>
                  </li>
                  <li>
                    <span>İşlem Şartı:</span>
                    <strong>{minTransactionCount > 0 ? `Son ${lookbackMonths} ayda ${minTransactionCount}+ işlem` : 'Adet Şartı Yok'}</strong>
                  </li>
                  <li>
                    <span>İndirim / Oran:</span>
                    <strong>%{discountPercent} (Maks. {maxDiscountAmount} ₺)</strong>
                  </li>
                  <li>
                    <span>Min. Sepet:</span>
                    <strong>{minSpendAmount} ₺ ve üzeri</strong>
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
