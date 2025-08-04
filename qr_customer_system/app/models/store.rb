class Store < ApplicationRecord
  has_many :catalog_items, dependent: :destroy
  has_many :customers, dependent: :destroy
  has_many :review_questions, dependent: :destroy
  has_many :qr_codes, dependent: :destroy
  belongs_to :admin

  validates :name, presence: true
  validates :address, presence: true

  def generate_qr_code
    qr_code = QrCode.create!(store: self, code: SecureRandom.hex(16))
    qr_code
  end
end