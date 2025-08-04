class Api::V1::Customer::AuthController < ApplicationController
  def register
    store = Store.find(params[:store_id])
    customer = store.customers.build(customer_params)
    
    if customer.save
      render json: {
        message: 'Registration successful',
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        }
      }, status: :created
    else
      render json: { errors: customer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def verify_otp
    customer = Customer.find_by(email: params[:email])
    
    if customer && Customer.authenticate_otp(params[:email], params[:otp])
      customer.update!(verified: true)
      render json: {
        message: 'OTP verified successfully',
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          verified: true
        }
      }
    else
      render json: { error: 'Invalid OTP' }, status: :unauthorized
    end
  end

  def send_otp
    # Fake OTP sending - in real implementation, you'd send SMS/Email
    render json: {
      message: 'OTP sent successfully',
      otp: '123456' # For demo purposes only
    }
  end

  private

  def customer_params
    params.require(:customer).permit(:name, :email, :phone, :address)
  end
end