class ReviewQuestion < ApplicationRecord
  belongs_to :store
  has_many :review_answers, dependent: :destroy

  validates :question, presence: true
  validates :question_type, presence: true, inclusion: { in: %w[rating text multiple_choice] }

  scope :active, -> { where(active: true) }
  scope :ordered, -> { order(:order_index) }
end