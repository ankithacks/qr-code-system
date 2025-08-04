class Admin < ApplicationRecord
  has_secure_password
  has_many :stores, dependent: :destroy

  validates :email, presence: true, uniqueness: true
  validates :name, presence: true

  def generate_jwt_token
    payload = { admin_id: id, exp: 24.hours.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base)
  end
end