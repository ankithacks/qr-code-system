# class Api::V1::Customer::ScanController < ApplicationController
#   def scan
#     qr_code = QrCode.find_by(code: params[:qr_code])
    
#     unless qr_code&.active?
#       return render json: { error: 'Invalid or inactive QR code' }, status: :not_found
#     end

#     store = qr_code.store
#     render json: {
#       store: {
#         id: store.id,
#         name: store.name,
#         description: store.description,
#         address: store.address
#       },
#       options: [
#         { type: 'catalog', label: 'Browse Catalog' },
#         { type: 'review', label: 'Write Review' }
#       ]
#     }
#   end
# end


class ScanController < ApplicationController
  def show
    qr_code = QrCode.find_by(code: params[:code])

    if qr_code
      store = qr_code.store
      render json: {
        id: store.id,
        name: store.name,
        description: store.description,
        address: store.address,
        phone: store.phone,
        email: store.email
      }
    else
      render json: { error: 'Invalid QR code' }, status: :not_found
    end
  end
end
