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
      decoded_token = JWT.decode(token, Rails.application.secret_key_base)
      @current_admin = Admin.find(decoded_token[0]['admin_id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_admin
    @current_admin
  end
end