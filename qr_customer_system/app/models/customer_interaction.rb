class CustomerInteraction < ApplicationRecord
  belongs_to :customer
  belongs_to :catalog_item, optional: true

  validates :interaction_type, presence: true, inclusion: { in: %w[view catalog_browse review_submit] }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_type, ->(type) { where(interaction_type: type) }
end