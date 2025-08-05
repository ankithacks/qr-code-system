class ApplicationController < ActionController::API
  before_action :set_cors_headers

  private

  def set_cors_headers
    headers['Access-Control-Allow-Origin'] = '*'
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    headers['Access-Control-Allow-Headers'] = 'Origin, Content-Type, Accept, Authorization, Token'
  end

  def authenticate_admin
  token = request.headers['Authorization']&.split(' ')&.last
  return render json: { error: 'Unauthorized' }, status: :unauthorized unless token

  begin
    secret = ENV['JWT_SECRET_KEY'] || Rails.application.credentials.secret_key_base
    decoded_token = JWT.decode(token, secret)[0]
    @current_admin = Admin.find(decoded_token['admin_id'])
  rescue JWT::DecodeError, ActiveRecord::RecordNotFound
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end
end

  def current_admin
    @current_admin
  end
end