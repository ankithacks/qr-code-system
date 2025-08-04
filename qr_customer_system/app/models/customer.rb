class Customer < ApplicationRecord
  belongs_to :store
  has_many :customer_interactions, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_many :purchases, dependent: :destroy

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :phone, presence: true
  validates :name, presence: true

  def self.authenticate_otp(email, otp)
    # Fake OTP system - in real implementation, you'd verify against sent OTP
    return false unless otp == "123456" # Fake OTP for demo
    true
  end
end