class QrCode < ApplicationRecord
  belongs_to :store

  validates :code, presence: true, uniqueness: true
end
