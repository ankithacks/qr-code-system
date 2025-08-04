class ReviewAnswer < ApplicationRecord
  belongs_to :review
  belongs_to :review_question

  validates :answer, presence: true
end