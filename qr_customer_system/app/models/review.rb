class Review < ApplicationRecord
  belongs_to :customer
  belongs_to :catalog_item
  has_many :review_answers, dependent: :destroy

  validates :overall_rating, presence: true, inclusion: { in: 1..5 }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_rating, ->(rating) { where(overall_rating: rating) }
end