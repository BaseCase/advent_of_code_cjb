puts "Starting part 1..."

twos = 0
threes = 0

File.read('./input.txt').split("\n").each do |line|
  counts = Hash.new { |h, k| h[k] = 0 }
  line.each_char { |c| counts[c] += 1 }
  if counts.values.include? 2 then twos += 1 end
  if counts.values.include? 3 then threes += 1 end
end

puts "Checksum is #{twos * threes}"

