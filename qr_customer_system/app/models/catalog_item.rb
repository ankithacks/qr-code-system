class CatalogItem < ApplicationRecord
  belongs_to :store
  has_many :purchases, dependent: :destroy
  has_many :reviews, dependent: :destroy
  has_one_attached :image

  validates :name, presence: true
  validates :price, presence: true, numericality: { greater_than: 0 }

  scope :with_offers, -> { where.not(offer_price: nil) }
  scope :by_store, ->(store_id) { where(store_id: store_id) }
  scope :active, -> { where(active: true) }  
end