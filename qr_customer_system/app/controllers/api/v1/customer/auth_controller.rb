class Api::V1::Customer::AuthController < ApplicationController
  def register
    store = Store.find(params[:store_id])
    customer = store.customers.build(customer_params)

    if customer.save
      otp = generate_and_store_otp(customer)

      render json: {
        message: 'Registration successful. OTP sent.',
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
          phone: customer.phone
        },
        otp: otp # Return OTP directly for demo/testing
      }, status: :created
    else
      render json: { errors: customer.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def verify_otp
    customer = Customer.find_by(email: params[:email])

    if customer
      stored_otp = Rails.cache.read("otp:#{customer.email}")
      if stored_otp.present? && stored_otp == params[:otp]
        customer.update!(verified: true)
        Rails.cache.delete("otp:#{customer.email}")

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
        render json: { error: 'Invalid or expired OTP' }, status: :unauthorized
      end
    else
      render json: { error: 'Customer not found' }, status: :not_found
    end
  end

  def send_otp
    customer = Customer.find_by(email: params[:email])
    if customer
      otp = generate_and_store_otp(customer)

      render json: {
        message: 'OTP sent successfully',
        otp: otp
      }
    else
      render json: { error: 'Customer not found' }, status: :not_found
    end
  end

  def login
  customer = Customer.find_by(email: params[:email])

  if customer&.authenticate(params[:password])
    render json: {
      success: true,
      customer_id: customer.id,
      store_id: customer.store_id,
      message: "Login successful"
    }, status: :ok
  else
    render json: { success: false, message: "Invalid email or password" }, status: :unauthorized
  end
end

  private

  def customer_params
    params.require(:customer).permit(:name, :email, :phone, :address, :password, :password_confirmation)
  end

  def generate_and_store_otp(customer)
    otp = rand(100000..999999).to_s
    Rails.cache.write("otp:#{customer.email}", otp, expires_in: 10.minutes)
    otp
  end
end
