import { supabase } from "../integrations/supabase/client";
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, CreditCard, Smartphone, DollarSign, Save, X, Video, CameraOff } from 'lucide-react';

interface CheckInProps {
  roomNumber: string;
  onCheckIn: (guestData: any) => void;
  t: (key: string) => string;
}

interface GuestData {
  photo?: string;
  fullName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  documentNumber: string;
  email: string;
  phone: string;
  companions: number;
  companionDetails: Array<{
    name: string;
    relationship: string;
    photo?: string;
  }>;
  paymentMethod: 'cash' | 'pix' | 'card';
  paymentDetails: {
    cardName?: string;
    cardNumber?: string;
    cardExpiry?: string;
    cardCVC?: string;
    pixTransaction?: string;
    cashCurrency?: string;
  };
  notes: string;
  checkInDate: string;
  checkOutDate: string;
}

export const CheckIn: React.FC<CheckInProps> = ({ roomNumber, onCheckIn, t }) => {
  const { toast } = useToast();
  
  const [guestData, setGuestData] = useState<GuestData>({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "Paraguay",
    documentNumber: "",
    email: "",
    phone: "",
    companions: 0,
    companionDetails: [],
    paymentMethod: "cash",
    paymentDetails: {},
    notes: "",
    checkInDate: new Date().toISOString().split("T")[0],
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      stopCamera();
    } else {
      setPhotoFile(null);
      setPhotoPreview(null);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera:", err);
      toast({
        title: "Erro ao acessar a câmera",
        description: "Verifique se você concedeu permissão para usar a câmera.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `guest_photo_${Date.now()}.png`, { type: "image/png" });
            setPhotoFile(file);
            setPhotoPreview(URL.createObjectURL(file));
            stopCamera();
          }
        }, "image/png");
      }
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const uploadPhoto = async (): Promise<string | undefined> => {
    if (!photoFile) return undefined;

    const fileExt = photoFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `guest_photos/${fileName}`;

    const { data, error } = await supabase.storage
      .from("guest-photos") // Certifique-se de que este bucket existe no Supabase
      .upload(filePath, photoFile, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Erro ao fazer upload da foto:", error);
      toast({
        title: "Erro no upload da foto",
        description: error.message,
        variant: "destructive",
      });
      return undefined;
    }

    const { data: publicUrlData } = supabase.storage
      .from("guest-photos")
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!guestData.fullName || !guestData.documentNumber || !guestData.paymentMethod) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    let photoUrl: string | undefined;
    if (photoFile) {
      photoUrl = await uploadPhoto();
      if (!photoUrl) {
        // Se o upload falhar, não prosseguir com o check-in
        return;
      }
    }

    // Simulate saving to database
    console.log("Guardando datos del huésped:", guestData);
    
    onCheckIn({
      name: guestData.fullName,
      photo: photoUrl, // Passa a URL da foto
      checkIn: guestData.checkInDate,
      checkOut: guestData.checkOutDate,
      notes: guestData.notes,
      ...guestData,
    });

    toast({
      title: "Check-in completado",
      description: `Huésped registrado en habitación ${roomNumber}`,
      variant: "default",
    });
  };

  const addCompanion = () => {
    if (guestData.companionDetails.length < 4) {
      setGuestData(prev => ({
        ...prev,
        companionDetails: [...prev.companionDetails, { name: "", relationship: "" }]
      }));
    }
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      {/* Guest Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            {t("form.guest.photo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center gap-4">
              {photoPreview && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground">
                  <img src={photoPreview} alt="Guest Preview" className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 h-auto"
                    onClick={() => { setPhotoPreview(null); setPhotoFile(null); }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {!photoPreview && stream && (
                <div className="relative w-64 h-48 bg-black rounded-lg overflow-hidden">
                  <video ref={videoRef} className="w-full h-full object-cover"></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
              )}

              <Input
                id="guestPhoto"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
                ref={fileInputRef}
              />

              <div className="flex gap-2">
                <Button type="button" onClick={handleDivClick} className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Subir Foto
                </Button>
                <Button type="button" onClick={startCamera} className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Tirar Foto
                </Button>
                {stream && (
                  <>
                    <Button type="button" onClick={takePhoto} className="flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Capturar
                    </Button>
                    <Button type="button" onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                      <CameraOff className="w-4 h-4" />
                      Parar Câmera
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Personal Information */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">{t('form.full.name')} *</Label>
            <Input
              id="fullName"
              value={guestData.fullName}
              onChange={(e) => setGuestData(prev => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="documentNumber">{t('form.document.number')} *</Label>
            <Input
              id="documentNumber"
              value={guestData.documentNumber}
              onChange={(e) => setGuestData(prev => ({ ...prev, documentNumber: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('form.email')}</Label>
            <Input
              id="email"
              type="email"
              value={guestData.email}
              onChange={(e) => setGuestData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">{t('form.phone')}</Label>
            <Input
              id="phone"
              value={guestData.phone}
              onChange={(e) => setGuestData(prev => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">{t('form.address')}</Label>
            <Input
              id="address"
              value={guestData.address}
              onChange={(e) => setGuestData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">{t('form.city')}</Label>
            <Input
              id="city"
              value={guestData.city}
              onChange={(e) => setGuestData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">{t('form.state')}</Label>
            <Input
              id="state"
              value={guestData.state}
              onChange={(e) => setGuestData(prev => ({ ...prev, state: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">{t('form.country')}</Label>
            <Input
              id="country"
              value={guestData.country}
              onChange={(e) => setGuestData(prev => ({ ...prev, country: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t('form.payment.method')} *
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select 
            value={guestData.paymentMethod} 
            onValueChange={(value: 'cash' | 'pix' | 'card') => 
              setGuestData(prev => ({ ...prev, paymentMethod: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar método de pago" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  {t('payment.cash')}
                </div>
              </SelectItem>
              <SelectItem value="pix">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  {t('payment.pix')}
                </div>
              </SelectItem>
              <SelectItem value="card">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  {t('payment.card')}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Details */}
          {guestData.paymentMethod === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
              <div className="space-y-2 md:col-span-2">
                <Label>Nombre en la tarjeta</Label>
                <Input
                  value={guestData.paymentDetails.cardName || ''}
                  onChange={(e) => setGuestData(prev => ({
                    ...prev,
                    paymentDetails: { ...prev.paymentDetails, cardName: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Número de tarjeta</Label>
                <Input
                  value={guestData.paymentDetails.cardNumber || ''}
                  onChange={(e) => setGuestData(prev => ({
                    ...prev,
                    paymentDetails: { ...prev.paymentDetails, cardNumber: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>CVC</Label>
                <Input
                  value={guestData.paymentDetails.cardCVC || ''}
                  onChange={(e) => setGuestData(prev => ({
                    ...prev,
                    paymentDetails: { ...prev.paymentDetails, cardCVC: e.target.value }
                  }))}
                />
              </div>
            </div>
          )}

          {guestData.paymentMethod === 'pix' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <Label>Número de transacción PIX</Label>
              <Input
                value={guestData.paymentDetails.pixTransaction || ''}
                onChange={(e) => setGuestData(prev => ({
                  ...prev,
                  paymentDetails: { ...prev.paymentDetails, pixTransaction: e.target.value }
                }))}
              />
            </div>
          )}

          {guestData.paymentMethod === 'cash' && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <Label>Moneda</Label>
              <Select 
                value={guestData.paymentDetails.cashCurrency || 'PYG'}
                onValueChange={(value) => setGuestData(prev => ({
                  ...prev,
                  paymentDetails: { ...prev.paymentDetails, cashCurrency: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PYG">Guaraníes (PYG)</SelectItem>
                  <SelectItem value="USD">Dólares (USD)</SelectItem>
                  <SelectItem value="BRL">Reales (BRL)</SelectItem>
                  <SelectItem value="EUR">Euros (EUR)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Companions */}
      <Card>
        <CardHeader>
          <CardTitle>Acompanhantes</CardTitle>
        </CardHeader>
        <CardContent>
          {guestData.companionDetails.map((companion, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 mb-4 p-4 border rounded-lg">
              <div className="space-y-2">
                <Label>Nome do Acompanhante</Label>
                <Input
                  value={companion.name}
                  onChange={(e) => {
                    const newCompanions = [...guestData.companionDetails];
                    newCompanions[index].name = e.target.value;
                    setGuestData(prev => ({ ...prev, companionDetails: newCompanions }));
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Parentesco</Label>
                <Input
                  value={companion.relationship}
                  onChange={(e) => {
                    const newCompanions = [...guestData.companionDetails];
                    newCompanions[index].relationship = e.target.value;
                    setGuestData(prev => ({ ...prev, companionDetails: newCompanions }));
                  }}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addCompanion}>
            Adicionar Acompanhante
          </Button>
        </CardContent>
      </Card>

      {/* Dates and Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Estadía y Observaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkIn">Fecha Check-in</Label>
              <Input
                id="checkIn"
                type="date"
                value={guestData.checkInDate}
                onChange={(e) => setGuestData(prev => ({ ...prev, checkInDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOut">Fecha Check-out</Label>
              <Input
                id="checkOut"
                type="date"
                value={guestData.checkOutDate}
                onChange={(e) => setGuestData(prev => ({ ...prev, checkOutDate: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas y recordatorios</Label>
            <Textarea
              id="notes"
              placeholder="Ej: Despertar a las 7:00 AM, alérgico a..."
              value={guestData.notes}
              onChange={(e) => setGuestData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline">
          <X className="w-4 h-4 mr-2" />
          {t('form.cancel')}
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-hotel-red to-hotel-navy">
          <Save className="w-4 h-4 mr-2" />
          {t('form.save')}
        </Button>
      </div>
    </form>
  );
};

export const CheckOut: React.FC<{ roomNumber: string }> = ({ roomNumber }) => {
  return <div>Check-out para habitación {roomNumber}</div>;
};

export const Invoice: React.FC<{ roomNumber: string }> = ({ roomNumber }) => {
  return <div>Factura para habitación {roomNumber}</div>;
};