const Club = require("../models/Club");
const User = require("../models/User");

const getOverview = async (req, res) => {
  try {
    // Tổng số CLB
    const totalClubs = await Club.countDocuments();

    // Tổng số thành viên
    const totalMembers = await User.countDocuments({ role: "student" });

    // Tổng số chủ nhiệm CLB
    const totalPresidents = await User.countDocuments({ role: "clubadmin" });

    // Thống kê thành viên theo tháng (6 tháng gần nhất)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const monthlyAgg = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          members: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthlyMembers = monthlyAgg.map(m => ({
      month: `Tháng ${m._id}`,
      members: m.members
    }));

    // Thành viên mới (5 user gần nhất)
    const newMembers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("clubId", "name")
      .select("name role createdAt clubId");

    res.json({
      totalClubs,
      totalMembers,
      totalPresidents,
      monthlyMembers,
      newMembers: newMembers.map(u => ({
        _id: u._id,
        name: u.name,
        role: u.role,
        createdAt: u.createdAt,
        club: u.clubId ? { name: u.clubId.name } : null
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOverview };
