class Api::V1::Admin::AuthController < ApplicationController
def login
  email = params[:email] || params.dig(:auth, :email)
  password = params[:password] || params.dig(:auth, :password)

  Rails.logger.info "Login attempt for: #{email}"
  admin = Admin.find_by(email: email)
  Rails.logger.info "Admin found: #{admin.present?}"

  if admin && admin.authenticate(password)
    token = admin.generate_jwt_token
    render json: {
      message: 'Login successful',
      token: token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email
      }
    }
  else
    render json: { error: 'Invalid credentials' }, status: :unauthorized
  end
end


  def register
    admin = Admin.new(admin_params)
    
    if admin.save
      token = admin.generate_jwt_token
      render json: {
        message: 'Registration successful',
        token: token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email
        }
      }, status: :created
    else
      render json: { errors: admin.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def admin_params
    params.require(:admin).permit(:name, :email, :password, :password_confirmation)
  end
end
