class Purchase < ApplicationRecord
  belongs_to :customer
  belongs_to :catalog_item

  validates :quantity, presence: true, numericality: { greater_than: 0 }
  validates :price_paid, presence: true, numericality: { greater_than: 0 }

  scope :recent, -> { order(created_at: :desc) }
end
