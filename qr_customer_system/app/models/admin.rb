class Admin < ApplicationRecord
  has_secure_password
  has_many :stores, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  def generate_jwt_token
    payload = { admin_id: id, exp: 7.days.from_now.to_i }
    secret_key = Rails.application.credentials.secret_key_base || ENV['SECRET_KEY_BASE']
    JWT.encode(payload, secret_key, 'HS256')
  end
end