class Api::V1::Customer::ScanController < ApplicationController
  def scan
    qr_code = QrCode.find_by(code: params[:qr_code])
    
    unless qr_code&.active?
      return render json: { error: 'Invalid or inactive QR code' }, status: :not_found
    end

    store = qr_code.store
    render json: {
      store: {
        id: store.id,
        name: store.name,
        description: store.description,
        address: store.address
      },
      options: [
        { type: 'catalog', label: 'Browse Catalog' },
        { type: 'review', label: 'Write Review' }
      ]
    }
  end
end