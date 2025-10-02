export type Page = {
    id: string
    title: string
    content: string
    image?: string
    pageNumber: number
}

export type WorkReader = {
    id: string
    title: string
    year?: string
    cover: string
    pages: Page[]
    totalPages: number
    readingTime: number
    views: number
    likes: number
    summary: string
    tags: string[]
}

export type WorkDetail = {
    id: string
    title: string
    year?: string
    summary: string
    cover: string
    tags?: string[]
    content: string
    chapters: Chapter[]
    readingTime: number
    views: number
    likes: number
}

export type Chapter = {
    id: string
    title: string
    content: string
    duration: number
}

export const WORK_READER_DATA: Record<string, WorkReader> = {
    'duong-kach-menh': {
        id: 'duong-kach-menh',
        title: 'Đường Kách Mệnh',
        year: '1927',
        cover: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_Cbs0tqaY19-_PE8SsvifSTPCfbjXyV0ibw&s',
        totalPages: 8,
        readingTime: 90,
        views: 1250,
        likes: 89,
        summary: 'Tập hợp các bài giảng về con đường cách mạng giải phóng dân tộc; đặt nền móng tư tưởng cho phong trào cách mạng Việt Nam thời kỳ mới.',
        tags: ['Cách mạng', 'Tư tưởng', 'Giáo dục'],
        pages: [
            {
                id: 'page-1',
                title: 'Giới thiệu và Mục đích của Tác phẩm',
                content: `Tác phẩm "Đường Cách Mệnh" là tuyển tập các bài giảng của Nguyễn Ái Quốc tại các lớp huấn luyện cán bộ của Hội Việt Nam Cách mạng Thanh niên ở Quảng Châu (1925-1927). Được xuất bản lần đầu vào năm 1927 bởi Bộ Tuyên truyền của Hội Liên hiệp các dân tộc bị áp bức ở Á Đông.

Mục đích của cuốn sách:
• Giải thích: Vì sao muốn sống thì phải làm cách mạng
• Khẳng định: Cách mạng là sự nghiệp chung của toàn dân chứ không phải của một vài cá nhân
• Cung cấp kinh nghiệm: Đem lịch sử cách mạng các nước làm gương soi
• Mở rộng tầm nhìn: Phân tích phong trào thế giới để xác định bạn và thù
• Hướng dẫn hành động: Chỉ rõ cách thức tiến hành cách mạng

Tác phẩm được viết với văn phong súc tích, giản dị, dễ hiểu, dễ nhớ, với mục tiêu cốt lõi là làm cho đồng bào "xem rồi thì nghĩ lại, nghĩ rồi thì tỉnh dậy, tỉnh rồi thì đứng lên đoàn kết nhau mà làm cách mệnh."`,
                pageNumber: 1
            },
            {
                id: 'page-2',
                title: 'Định nghĩa và Phân loại Cách mạng',
                content: `Định nghĩa: Cách mạng được định nghĩa là "phá cái cũ đổi ra cái mới, phá cái xấu đổi ra cái tốt". Tác giả đưa ra các ví dụ từ khoa học (Galilê), cơ khí (Stephenson), sinh vật học (Darwin) đến kinh tế học (Các Mác) để minh họa cho khái niệm này.

Phân loại: Các cuộc cách mạng của dân chúng được chia thành ba loại chính:

1. Tư bản cách mệnh: Xung đột giữa tư bản mới (thành thị) và chế độ phong kiến (địa chủ). Ví dụ: Cách mạng Pháp 1789, Cách mạng Mỹ 1776.

2. Dân tộc cách mệnh: Một dân tộc bị áp bức nổi dậy lật đổ ách thống trị của một cường quyền bên ngoài. Ví dụ: Việt Nam chống Pháp, Ấn Độ chống Anh.

3. Giai cấp cách mệnh: Giai cấp bị áp bức (công nông) lật đổ giai cấp áp bức (tư bản). Ví dụ: Cách mạng Nga 1917.

Tác phẩm cũng phân biệt giữa dân tộc cách mệnh (sĩ, nông, công, thương nhất trí chống cường quyền) và thế giới cách mệnh (vô sản giai cấp khắp nơi liên hợp lại để đập đổ tư bản toàn cầu).`,
                pageNumber: 2
            },
            {
                id: 'page-3',
                title: 'Lực lượng và Điều kiện tiên quyết của Cách mạng',
                content: `Lực lượng:
• Gốc cách mệnh: Công nhân và nông dân (công nông) là lực lượng nòng cốt. Lý do là vì họ:
  1. Bị áp bức nặng nề nhất
  2. Là lực lượng đông đảo nhất, có sức mạnh lớn nhất
  3. Là những người "tay không chân rồi", nếu thua chỉ mất kiếp khổ, nếu thắng được cả thế giới, do đó họ rất gan góc

• Bầu bạn cách mệnh: Học trò, nhà buôn nhỏ, điền chủ nhỏ cũng bị tư bản áp bức nhưng ở mức độ nhẹ hơn, do đó họ chỉ là đồng minh của công nông.

Điều kiện tiên quyết:
• Phải có Đảng Cách mệnh: Đây là yếu tố quan trọng hàng đầu. "Đảng có vững cách mệnh mới thành công, cũng như người cầm lái có vững thuyền mới chạy."

• Phải có Chủ nghĩa làm cốt: "Đảng mà không có chủ nghĩa cũng như người không có trí khôn, tàu không có bàn chỉ nam." Tác phẩm khẳng định chủ nghĩa chân chính, chắc chắn và cách mệnh nhất là chủ nghĩa Lênin.`,
                pageNumber: 3
            },
            {
                id: 'page-4',
                title: 'Phân tích các Cuộc Cách mạng Lịch sử',
                content: `Cách mạng Mỹ (1776):
• Là cuộc cách mạng tư bản, do các thuộc địa ở Mỹ nổi dậy chống lại chính sách áp bức kinh tế của Anh
• Thành công trong việc giành độc lập và lập ra nước cộng hòa
• Tuy nhiên, được xem là cách mạng chưa đến nơi vì sau đó công nông vẫn cực khổ và phải tiếp tục mưu tính cách mạng lần thứ hai

Cách mạng Pháp (1789):
• Là cuộc cách mạng tư bản lật đổ chế độ phong kiến do tư bản liên minh với dân cày và thợ thuyền tiến hành
• Trải qua nhiều giai đoạn phức tạp, bao gồm cả Công xã Paris (1871), chính quyền vô sản đầu tiên
• Công xã thất bại do tổ chức chưa khéo, chưa liên minh với nông dân và bị tư bản Pháp cấu kết với giặc ngoài (Đức) để đàn áp

Cách mạng Nga (1917):
• Là cuộc cách mạng thành công và đến nơi duy nhất, nơi dân chúng thực sự được hưởng tự do, bình đẳng
• Thắng lợi nhờ sự lãnh đạo tài tình của Đảng Cộng sản (Bolshevik) và Lênin, biết chớp đúng thời cơ`,
                pageNumber: 4
            },
            {
                id: 'page-5',
                title: 'Hệ thống các Tổ chức Quốc tế Cách mạng',
                content: `Quốc tế Cộng sản (Đệ tam Quốc tế):
• Lịch sử: Kế thừa tinh thần cách mạng của Đệ nhất Quốc tế (do Mác và Ăngghen sáng lập) và đối lập hoàn toàn với Đệ nhị Quốc tế (đã phản bội, trở thành "chó săn cho tư bản")
• Mục tiêu: Đập đổ tư bản chủ nghĩa, làm cách mệnh thế giới, giành chính quyền về tay công nông
• Tầm quan trọng với Việt Nam: Quốc tế thứ ba đặc biệt quan tâm đến cách mạng ở các thuộc địa, thể hiện qua khẩu hiệu "Vô sản giai cấp và dân tộc bị áp bức trong thế giới liên hợp lại!"

Các Tổ chức Trực thuộc:
• Phụ nữ Quốc tế: Thành lập để tổ chức, huấn luyện và vận động phụ nữ công nông tham gia cách mạng
• Công nhân Quốc tế (Quốc tế Đỏ): Tổ chức của các công hội cách mạng, theo Đệ tam Quốc tế, chống lại Quốc tế "Vàng" của bọn cơ hội
• Cộng sản Thanh niên Quốc tế: Lực lượng thanh niên cách mạng, là nguồn bồi dưỡng nhân tài cho đảng cộng sản
• Quốc tế Giúp đỡ: Tổ chức cứu tế các nạn nhân của thiên tai và các cuộc bãi công`,
                pageNumber: 5
            },
            {
                id: 'page-6',
                title: 'Hướng dẫn Tổ chức Quần chúng - Công hội',
                content: `Tổ chức Công hội:

Mục đích: Đoàn kết công nhân, nghiên cứu cách đấu tranh, cải thiện đời sống, giữ gìn lợi quyền và cuối cùng là tham gia giải phóng quốc dân.

Cấu trúc: Tổ chức theo lối sản nghiệp (tất cả công nhân trong một nhà máy/ngành vào một hội) thì mạnh hơn lối nghề nghiệp.

Hệ thống: Phải có hệ thống thứ bậc chặt chẽ như quân đội, từ tiểu tổ (gốc của hội, không quá 10 người), chi bộ, tỉnh hội đến quốc hội.

Nguyên tắc: Hoạt động theo nguyên tắc dân chủ tập trung (mọi người được bàn bạc, nhưng khi đã quyết thì phải tuân theo mệnh lệnh tập trung). Tổ chức phải nghiêm nhặt, bí mật và thống nhất.

Nhiệm vụ cụ thể:
• Tìm hội viên mới, mở mang giáo dục
• Lập hợp tác xã, hội cứu tế
• Bài trừ tệ nạn (rượu, thuốc phiện)
• Đoàn kết dân cày để chuẩn bị cho cách mạng`,
                pageNumber: 6
            },
            {
                id: 'page-7',
                title: 'Hướng dẫn Tổ chức Quần chúng - Dân cày và Hợp tác xã',
                content: `Tổ chức Dân cày:

Lý do: Nông dân chiếm 90% dân số, bị đế quốc và địa chủ bóc lột nặng nề (mất đất, thuế cao, bị ép bán lúa gạo giá rẻ).

Cách thức: Tổ chức theo hệ thống từ hội làng, tổng, huyện, tỉnh đến toàn quốc. Khi cần giữ bí mật, có thể mượn danh nghĩa các phường hội truyền thống (phường lợp nhà, phường đánh cá...) để che mắt chính quyền.

Hợp tác xã:

Lý luận: Dựa trên nguyên tắc "Nhóm lại thành giàu, chia nhau thành khó". Đây là hình thức kinh tế tập thể để giúp người lao động thoát khỏi sự bóc lột trung gian của giới tư sản, nhà buôn.

Các loại hình:
1. Hợp tác xã tiền bạc (tín dụng): Giúp hội viên vay vốn làm ăn với lãi suất thấp
2. Hợp tác xã mua: Góp tiền mua sỉ hàng hóa để được giá rẻ và chất lượng tốt
3. Hợp tác xã bán: Tập hợp sản phẩm để bán với số lượng lớn, tránh bị thương lái ép giá
4. Hợp tác xã sinh sản: Cùng nhau sắm sửa tư liệu sản xuất chung (trâu bò, máy móc) để sử dụng hiệu quả`,
                pageNumber: 7
            },
            {
                id: 'page-8',
                title: 'Phẩm chất của Người Cách mệnh',
                content: `Đối với bản thân (Tự mình phải):
• Cần kiệm, hòa mà không tư
• Cả quyết sửa lỗi, cẩn thận không nhút nhát
• Hay hỏi, nhẫn nại, hay nghiên cứu xem xét
• Vị công vong tư, không hiếu danh, không kiêu ngạo
• Nói phải đi đôi với làm, giữ vững chủ nghĩa
• Hy sinh, ít tham muốn vật chất, và phải giữ bí mật

Đối với người khác (Đối người phải):
• Với từng người thì khoan thứ
• Với đoàn thể thì nghiêm
• Có lòng bày vẽ cho người khác
• Thẳng thắn nhưng không thô bạo (trực mà không táo bạo)
• Biết xem xét, đánh giá người

Trong công việc (Làm việc phải):
• Xem xét hoàn cảnh kỹ càng
• Quyết đoán
• Dũng cảm
• Phục tùng đoàn thể

Kết luận: Đường Cách Mệnh đã chỉ ra con đường đúng đắn cho cách mạng Việt Nam. Đó là con đường độc lập dân tộc gắn liền với chủ nghĩa xã hội, dựa trên lực lượng công nông, dưới sự lãnh đạo của Đảng Cộng sản với chủ nghĩa Mác-Lênin làm kim chỉ nam.`,
                pageNumber: 8
            }
        ]
    },
    'ban-an-che-do-thuc-dan-phap': {
        id: 'ban-an-che-do-thuc-dan-phap',
        title: 'Bản án chế độ thực dân Pháp',
        year: '1925',
        cover: 'https://www.nxbctqg.org.vn/img_data/images/741482510710_ban-an.jpg',
        totalPages: 12,
        readingTime: 120,
        views: 980,
        likes: 67,
        summary: 'Tác phẩm chính luận sắc bén vạch trần bản chất áp bức, bóc lột của chủ nghĩa thực dân; khơi dậy tinh thần đấu tranh của các dân tộc thuộc địa.',
        tags: ['Chính luận', 'Phê phán', 'Giải phóng dân tộc'],
        pages: [
            {
                id: 'page-1',
                title: 'Thuế Máu',
                content: `Chương này vạch trần sự bóc lột tàn nhẫn nhất: bóc lột sinh mạng người dân thuộc địa.

Sự Giả Dối: Trước năm 1914, người bản xứ bị coi là "giống người hèn hạ", "An-nam-mít bẩn thỉu". Nhưng khi chiến tranh nổ ra, họ lập tức được tâng bốc thành "những đứa con yêu", "bạn hiền" để phục vụ cho mục đích chiến tranh.

Tuyển Lính Tàn Bạo: Việc tuyển mộ lính diễn ra bằng các biện pháp cưỡng bức, lừa gạt. Những người khỏe mạnh, nghèo khổ bị đẩy ra chiến trường châu Âu, đối mặt với cái chết vì những mục đích xa lạ. Nhiều người phải tự làm mình tàn phế để trốn lính.

Hy Sinh và Bạc Bẽo: Sau khi bị vắt kiệt sức lực và hy sinh mạng sống nơi chiến trường, những người lính sống sót trở về lại bị đối xử như cũ, thậm chí còn bị tước đoạt tài sản. "Đối với người da trắng, người da màu, dù cũ hay mới, cũng chỉ là một giống người bẩn thỉu, cùng lắm chỉ có thể hoặc kéo xe tay hoặc đi lính gác cho họ mà thôi".`,
                pageNumber: 1
            },
            {
                id: 'page-2',
                title: 'Việc Đầu Độc Người Bản Xứ',
                content: `Chương này tập trung vào chính sách độc quyền rượu và thuốc phiện của chính quyền thực dân.

Công Cụ Cai Trị: Rượu và thuốc phiện được sử dụng như một công cụ để làm suy đồi và tê liệt ý chí phản kháng của người dân, đồng thời mang lại nguồn lợi nhuận khổng lồ cho ngân sách thuộc địa.

Ép Buộc Tiêu Thụ: Chính quyền thực dân đã dùng mọi biện pháp để ép người dân tiêu thụ rượu. Số liệu cho thấy mức tiêu thụ rượu tăng vọt. Ví dụ, một viên công sứ ở Bắc Kỳ ước tính số rượu tiêu thụ đã tăng từ 200.000 lít lên 560.000 lít.

Hệ Thống Quan Lại: Các quan chức được khuyến khích, thậm chí ép buộc phải tăng doanh số bán rượu, việc thăng chức của họ phụ thuộc vào việc họ bán được bao nhiêu. Điều này tạo ra một hệ thống quan lại chỉ quan tâm đến lợi ích từ việc đầu độc đồng bào mình.`,
                pageNumber: 2
            },
            {
                id: 'page-3',
                title: 'Chân Dung Bộ Máy Cai Trị',
                content: `Hai chương này vẽ nên bức tranh về sự thối nát, tàn bạo và ngu dốt của hệ thống quan lại thực dân.

Quan Thống Đốc: Các thống đốc được miêu tả là những kẻ tham lam, lạm dụng quyền lực để vơ vét của cải, như trường hợp thống đốc ở Đa-hô-mây bị tố cáo tham nhũng. Ông Méc-lanh, toàn quyền Đông Dương, bị chế giễu vì những lời tự ca ngợi trống rỗng trong khi đẩy hàng triệu người Việt Nam vào cảnh lầm than.

Quan Cai Trị Địa Phương: Các quan cai trị cấp thấp hơn (như "ông Xanh", "ông Đác-lơ") được mô tả là những bạo chúa thực sự. Họ tùy tiện đánh đập, tra tấn, và giết hại người dân mà không bị trừng phạt. Ông Đác-lơ được miêu tả như một kẻ cai trị bằng roi vọt và bạo lực, nắm trong tay mọi quyền hành từ tòa án, thuế khóa, đến tài sản và sinh mạng của người dân.`,
                pageNumber: 3
            },
            {
                id: 'page-4',
                title: 'Những "Nhà Khai Hóa"',
                content: `Chương này sử dụng giọng văn mỉa mai sâu cay để lật tẩy bộ mặt thật của những kẻ tự cho mình là đi "khai hóa văn minh".

Bản Chất Thật: Những "nhà khai hóa" thực chất là những kẻ cướp bóc, những tên côn đồ tàn bạo, coi mạng sống người bản xứ như cỏ rác.

Vô Số Vụ Việc Tàn Bạo: Tác phẩm liệt kê hàng loạt vụ việc cụ thể: một người Pháp bắn chết một người Việt Nam rồi thản nhiên nói "Tưởng con chim!"; một tên thực dân đánh đập một người phụ nữ đến sẩy thai; những vụ giết người, hãm hiếp được thực hiện một cách công khai và thường không bị trừng phạt.

Sự Bao Che: Hệ thống pháp luật và chính quyền thực dân thường bao che cho những tội ác này, cho thấy bạo lực đối với người bản xứ là một hành vi được ngầm chấp nhận.`,
                pageNumber: 4
            },
            {
                id: 'page-5',
                title: 'Bóc Lột Kinh Tế Toàn Diện',
                content: `Hai chương này đi sâu vào các khía cạnh kinh tế của chủ nghĩa thực dân.

Tham Nhũng Ngân Sách: Ngân sách Nam-kỳ tăng vọt từ 5,5 triệu đồng (1911) lên 12,8 triệu đồng (1922) không phải để phục vụ người dân mà để chi cho các khoản xa hoa của bộ máy cai trị: tiền đi lại, tiền thưởng, tiệc tùng, xây dựng dinh thự...

Thuế Khóa Nặng Nề: Người dân bản xứ phải chịu vô số thứ thuế: thuế thân tăng gấp đôi từ năm 1890 đến 1896, thuế ruộng đất, thuế muối... Thanh niên 18 tuổi đã phải đóng thuế. Việc nộp thuế là một gánh nặng khủng khiếp, nhiều người phải bán vợ đợ con để có tiền nộp sưu.

Lao Dịch Cưỡng Bức: Chính sách bắt phu làm đường, xây dựng công trình bị tố cáo là một hình thức nô lệ. Người dân bị bắt đi làm không công, trong điều kiện thiếu thốn, bị đánh đập, bệnh tật và chết chóc.`,
                pageNumber: 5
            },
            {
                id: 'page-6',
                title: 'Nền "Công Lý" Thực Dân',
                content: `Chương này cho thấy sự bất công và phân biệt đối xử trong hệ thống tư pháp thuộc địa.

Hai Thước Đo Công Lý: Một người Âu giết người bản xứ có thể được tha bổng hoặc chỉ bị phạt nhẹ. Ngược lại, một người bản xứ chỉ vì một lỗi nhỏ cũng có thể bị đánh đập và bỏ tù.

Tòa Án Là Công Cụ Đàn Áp: Các tòa án được lập ra không phải để bảo vệ công lý mà để bảo vệ quyền lợi của kẻ thống trị. Các bản án thường được định sẵn, và luật sư bào chữa cho người bản xứ thường bị làm khó dễ.

Ví Dụ Cụ Thể: Tác phẩm nêu nhiều vụ án, như vụ một người Pháp ở Rông-cơ đánh chết một người bản xứ chỉ vì va chạm nhỏ, hay vụ nhiều người Việt Nam bị kết án tù chỉ vì những tội danh bịa đặt.`,
                pageNumber: 6
            },
            {
                id: 'page-7',
                title: 'Chính Sách Ngu Dân',
                content: `Đây là chính sách nhằm kìm hãm sự phát triển trí tuệ của người dân thuộc địa để dễ bề cai trị.

Kiểm Duyệt Báo Chí: Mọi bài báo bằng tiếng bản xứ đều phải được kiểm duyệt trước khi in. Báo chí bị cấm đề cập đến các vấn đề chính trị nhạy cảm.

Hạn Chế Giáo Dục: Chính quyền thực dân không mở trường học mà lại mở nhiều nhà tù và sở bán rượu. Ngân sách chi cho giáo dục rất eo hẹp. Thanh niên Việt Nam muốn đi du học cũng bị ngăn cản bằng nhiều cách.

Mục Đích: Mục tiêu của chính sách này được tóm gọn trong một câu trích dẫn: "Làm cho dân ngu để dễ trị".`,
                pageNumber: 7
            },
            {
                id: 'page-8',
                title: 'Chủ Nghĩa Giáo Hội',
                content: `Chương này chỉ trích vai trò của một số nhà truyền giáo và nhà thờ trong việc hỗ trợ chủ nghĩa thực dân.

Công Cụ Xâm Lược: Các nhà truyền giáo bị xem là đội quân tiên phong, dọn đường cho quân đội xâm lược. Họ sử dụng nhà thờ làm nơi do thám, gây chia rẽ trong nhân dân.

Bóc Lột Kinh Tế: Nhà thờ bóc lột tín đồ bằng nhiều cách, chiếm đoạt đất đai của dân. Tác phẩm kể về những hành vi tàn bạo của các giáo sĩ, như đánh đập, giết hại người chống đối.

Xung Đột và Đạo Đức Giả: Tác phẩm cũng vạch trần những mâu thuẫn và tranh giành quyền lực giữa các phái bộ truyền giáo, cho thấy bản chất trần tục và vụ lợi đằng sau vỏ bọc tôn giáo.`,
                pageNumber: 8
            },
            {
                id: 'page-9',
                title: 'Nỗi Khổ Nhục Của Người Phụ Nữ Bản Xứ',
                content: `Đây là một chương đặc biệt, dành riêng để nói lên nỗi thống khổ của phụ nữ ở các nước thuộc địa.

Nạn Nhân của Bạo Lực: Phụ nữ bản xứ là nạn nhân của bạo lực kép: từ chế độ thực dân và từ chính những người đàn ông Pháp. Họ bị hãm hiếp, bị lạm dụng, bị coi như một món đồ chơi.

Sự Vô Pháp: Những hành vi tàn bạo đối với phụ nữ thường không bị pháp luật trừng trị. Tác phẩm kể lại nhiều câu chuyện đau lòng về những phụ nữ bị giết hại, bị đánh đập dã man bởi các quan chức, binh lính và chủ đồn điền Pháp.

Sự Bất Lực: Phụ nữ là tầng lớp yếu thế nhất, chịu đựng những nỗi đau không thể kể xiết dưới ách áp bức của chế độ thực dân.`,
                pageNumber: 9
            },
            {
                id: 'page-10',
                title: 'Nô Lệ Thức Tỉnh',
                content: `Chương cuối cùng mang một thông điệp lạc quan về sự trỗi dậy của phong trào đấu tranh.

Sự Thức Tỉnh: Các cuộc bãi công, biểu tình của công nhân ở các thuộc địa (Đa-hô-mây, Xy-ri...) cho thấy giai cấp công nhân và nhân dân thuộc địa đã bắt đầu thức tỉnh, nhận ra sức mạnh và giá trị của mình.

Ảnh Hưởng của Cách Mạng Nga: Tác phẩm khẳng định Cách mạng Tháng Mười Nga đã thổi một luồng sinh khí mới vào phong trào giải phóng dân tộc, giúp họ đoàn kết và đấu tranh có phương hướng.

Kêu Gọi Đoàn Kết: Tác phẩm kết thúc bằng lời kêu gọi đoàn kết giữa giai cấp công nhân ở các nước thuộc địa và giai cấp công nhân ở chính quốc để cùng nhau chống lại kẻ thù chung là chủ nghĩa tư bản đế quốc.`,
                pageNumber: 10
            },
            {
                id: 'page-11',
                title: 'Gửi Thanh Niên Việt-Nam',
                content: `Bức thư ngỏ này là một lời kêu gọi trực tiếp, đầy tâm huyết gửi đến thế hệ trẻ Việt Nam.

Kêu Gọi Thức Tỉnh: Nguyễn Ái Quốc kêu gọi thanh niên hãy nhận thức về tình cảnh nô lệ của đất nước, từ bỏ cuộc sống an phận để dấn thân vào con đường đấu tranh giải phóng dân tộc.

Vai Trò Tiên Phong: Bức thư nhấn mạnh vai trò của thanh niên là tương lai của đất nước, là lực lượng tiên phong trong cuộc cách mạng.

Tinh Thần Hy Sinh: Thanh niên được kêu gọi hãy có tinh thần hy sinh, dũng cảm đứng lên đấu tranh vì độc lập tự do của dân tộc, vì một tương lai tươi sáng cho đất nước.

Tầm Nhìn Tương Lai: Bức thư thể hiện niềm tin mạnh mẽ vào sức trẻ, vào khả năng của thế hệ thanh niên trong việc thay đổi vận mệnh của dân tộc.`,
                pageNumber: 11
            },
            {
                id: 'page-12',
                title: 'Kết Luận và Ý Nghĩa Lịch Sử',
                content: `"Bản án chế độ thực dân Pháp" là một tác phẩm có giá trị to lớn về nhiều mặt.

Giá Trị Lịch Sử: Tác phẩm là một bằng chứng không thể chối cãi về những tội ác mà chủ nghĩa thực dân đã gây ra cho các dân tộc bị trị. Nó ghi lại một cách chân thực và sinh động bức tranh đen tối của chế độ thực dân.

Vũ Khí Chính Trị: Đây là một vũ khí sắc bén, góp phần thức tỉnh và cổ vũ tinh thần đấu tranh của hàng triệu người dân thuộc địa. Tác phẩm đã trở thành nguồn cảm hứng cho phong trào giải phóng dân tộc.

Giá Trị Văn Học: Tác phẩm là một áng văn chính luận mẫu mực với lập luận chặt chẽ, dẫn chứng phong phú, và giọng văn đầy biến hóa: khi thì đanh thép tố cáo, khi thì mỉa mai châm biếm, lúc lại trữ tình tha thiết.

Khẳng Định Vị Thế: Tác phẩm đã khẳng định vị thế của Nguyễn Ái Quốc như một nhà tư tưởng, một nhà cách mạng lỗi lạc và một nhà văn hóa kiệt xuất, đặt nền móng cho tư tưởng Hồ Chí Minh về giải phóng dân tộc và xây dựng đất nước.`,
                pageNumber: 12
            }
        ]
    },
    'nhat-ky-trong-tu': {
        id: 'nhat-ky-trong-tu',
        title: 'Nhật Ký Trong Tù',
        year: '1942-1943',
        cover: 'https://product.hstatic.net/1000363117/product/nhat-ky-trong-tu_c1b8b8b8b8b8b8b8b8b8b8b8b8b8b8b8.jpg',
        totalPages: 10,
        readingTime: 100,
        views: 1520,
        likes: 145,
        summary: 'Tập thơ chữ Hán được sáng tác trong thời gian bị giam giữ, thể hiện ý chí bất khuất và tinh thần lạc quan của người chiến sĩ cách mạng.',
        tags: ['Thơ ca', 'Nhật ký', 'Cách mạng', 'Triết lý'],
        pages: [
            {
                id: 'page-1',
                title: 'Giới Thiệu và Bối Cảnh Sáng Tác',
                content: `"Nhật ký trong tù" là tập thơ chữ Hán do Chủ tịch Hồ Chí Minh sáng tác trong hơn một năm (tháng 8-1942 đến tháng 9-1943) khi Người bị giam giữ tại các nhà tù của chính quyền Tưởng Giới Thạch ở tỉnh Quảng Tây, Trung Quốc.

Bối Cảnh Lịch Sử: Tác phẩm này được công nhận là một văn kiện lịch sử quan trọng và một tác phẩm văn học lớn, thể hiện sâu sắc tư tưởng và tình cảm của một vị anh hùng giải phóng dân tộc và nhà văn hóa kiệt xuất của Việt Nam.

Ý Nghĩa: Theo lời của cố Thủ tướng Phạm Văn Đồng, tập thơ này là "một kho tàng về biết bao khía cạnh của cuộc đời, con người và nghệ thuật mà sự phong phú còn cần được tiếp tục nghiên cứu."

Hành Trình Đày Ải: Tác phẩm vừa là một biên niên sử ghi lại chặng đường đày ải qua 13 huyện và 18 nhà lao, vừa là một minh chứng cho nghị lực phi thường và tâm hồn cao đẹp của người chiến sĩ cách mạng.

Giá Trị Kép: Đây không chỉ là một nhật ký cá nhân mà còn là một tuyên ngôn về tinh thần cách mạng, lòng yêu nước và khát vọng tự do cháy bỏng.`,
                pageNumber: 1
            },
            {
                id: 'page-2',
                title: 'Ý Chí Bất Khuất và Tinh Thần Lạc Quan',
                content: `Đây là chủ đề xuyên suốt, thể hiện rõ nhất qua tinh thần "thép" của người tù cách mạng. Ngay từ bài thơ đầu tiên, được coi như lời đề từ, tác giả đã khẳng định sự đối lập giữa thể xác và tinh thần:

"Thân thể ở trong lao,
Tinh thần ở ngoài lao;
Muốn nên sự nghiệp lớn,
Tinh thần càng phải cao."

Sự Tự Chủ Trước Nghịch Cảnh: Dù bị đày ải, tác giả vẫn giữ vững phong thái ung dung, tự tại. Khi bị trói, Người ví mình như "quan võ đủ tua, đai" hay "khanh tướng vẻ ung dung". Khi đối mặt với tai ương, Người coi đó là cơ hội để rèn luyện.

Lạc Quan Trong Gian Khổ: Ngay cả trong những hoàn cảnh tồi tệ nhất, tác giả vẫn tìm thấy ánh sáng và hy vọng. Buổi sáng trong tù, dù "cửa vẫn cài" và "còn tối mịt", nhưng "Ánh hồng trước mặt đã bừng soi".

Tâm Hồn Hướng Về Cách Mạng: Nỗi trăn trở lớn nhất của người tù không phải là sự đau khổ của bản thân mà là sự nghiệp chung của dân tộc. Giấc ngủ chập chờn luôn hướng về Tổ quốc.`,
                pageNumber: 2
            },
            {
                id: 'page-3',
                title: 'Giao Hòa Với Thiên Nhiên',
                content: `Dù bị giam cầm trong không gian chật hẹp, tâm hồn tác giả vẫn vươn ra ngoài để giao cảm với thiên nhiên, biến thiên nhiên thành người bạn tri kỷ.

Cuộc Ngắm Trăng Trong Tù: Cuộc ngắm trăng trong tù trở thành một cuộc giao cảm đặc biệt, nơi tác giả tìm thấy sự an ủi và nguồn cảm hứng từ vẻ đẹp tự nhiên.

Thiên Nhiên Như Người Bạn: Trong hoàn cảnh cô đơn, thiên nhiên trở thành người bạn đồng hành, giúp tác giả vượt qua những giờ phút khó khăn nhất.

Tìm Kiếm Vẻ Đẹp: Ngay cả trong tù, tác giả vẫn có thể tìm thấy và trân trọng vẻ đẹp của thiên nhiên, thể hiện một tâm hồn nghệ sĩ tinh tế và nhạy cảm.

Triết Lý Về Tự Do: Qua việc giao cảm với thiên nhiên, tác giả thể hiện rằng tinh thần có thể tự do ngay cả khi thể xác bị giam cầm.

Nguồn Cảm Hứng: Thiên nhiên không chỉ là đối tượng quan sát mà còn là nguồn cảm hứng bất tận cho sáng tác thơ ca trong những ngày tháng tù đày.`,
                pageNumber: 3
            },
            {
                id: 'page-4',
                title: 'Hiện Thực Tàn Khốc - Điều Kiện Sống',
                content: `Tập thơ là một bức tranh chi tiết, chân thực về chế độ nhà tù tàn bạo của Quốc dân Đảng Trung Quốc.

Điều Kiện Ăn Uống: Bữa ăn chỉ có "một bát cơm gạo đỏ, Không muối, không rau cũng chẳng canh" hoặc "mỗi bữa một bát cháo của nhà nước, Cái bụng luôn luôn than phiền".

Sinh Hoạt Hàng Ngày: Tù nhân phải chia nhau từng nửa chậu nước để "rửa mặt hoặc đun trà". Đêm đến thì "không đệm cũng không chăn", phải "nằm co cẳng cong lưng vẫn không ngủ được".

Bệnh Tật Hoành Hành: Ghẻ lở, bệnh tật lan tràn: "Xanh đỏ đầy người như áo gấm, Suốt ngày sột soạt tự gảy đàn".

Vệ Sinh Kém: Điều kiện vệ sinh cực kỳ tồi tệ, thiếu nước sạch, không có đủ dụng cụ sinh hoạt cơ bản.

Không Gian Chật Hẹp: Tù nhân bị nhốt trong những căn phòng nhỏ, thiếu ánh sáng và không khí trong lành.

Sự Thiếu Thốn: Thiếu thốn về mọi mặt từ thức ăn, nước uống đến quần áo, chăn màn.`,
                pageNumber: 4
            },
            {
                id: 'page-5',
                title: 'Sự Đày Ải và Di Chuyển Liên Tục',
                content: `Tác giả bị giải đi qua "mười ba huyện tỉnh Quảng Tây" và ở "mười tám nhà lao". Những cuộc chuyển lao đầy gian khổ thể hiện sự tàn nhẫn của chế độ.

Hành Trình Gian Khổ: "Ngày đi năm mươi ba cây số, Ướt hết mũ áo, rách hết giày". Việc bị giải đi lòng vòng không mục đích khiến Người phải thốt lên những lời phàn nàn chính đáng.

Sự Đối Xử Vô Nhân Đạo: Tù nhân bị cùm chân hàng đêm, bị coi rẻ hơn cả súc vật: "Ta thì người dắt, lợn người khiêng; Con người coi rẻ hơn con lợn".

Nỗi Khổ Của Bạn Tù: Tác giả cũng chứng kiến và đồng cảm với nỗi đau của những người bạn tù: cảnh vợ thăm chồng qua song sắt, cái chết thảm thương của tù nhân vì đói rét.

Sự Tùy Tiện: Việc di chuyển tù nhân diễn ra một cách tùy tiện, không có lý do chính đáng, chỉ để gây khổ sở và làm suy sụp tinh thần.

Thiếu Nhân Đạo: Không có sự quan tâm đến sức khỏe và tính mạng của tù nhân trong những cuộc hành quân dài.

Mục Đích Đàn Áp: Những cuộc di chuyển này nhằm mục đích đàn áp tinh thần và làm suy yếu ý chí của tù nhân chính trị.`,
                pageNumber: 5
            },
            {
                id: 'page-6',
                title: 'Phê Phán Sự Bất Công và Châm Biếm',
                content: `Bằng ngòi bút sắc sảo, tác giả đã vạch trần bản chất của chế độ Tưởng Giới Thạch.

Sự Bất Công Vô Lý: Tác giả, một đại biểu của nhân dân Việt Nam, bị bắt giam vô cớ với tội danh "tình nghi là gián điệp". Người mỉa mai sự đối xử khác biệt giữa mình và phái đoàn Mỹ.

Tham Nhũng Tràn Lan: Tiền công thổi cơm, mua nước sôi bị tính giá cắt cổ. Tiền vào tù là một lệ bắt buộc. Quan chức thì "tham lam ăn tiền phạm nhân bị giải".

Tệ Nạn Công Khai: Đánh bạc bị cấm ngoài xã hội nhưng lại được công khai trong tù, nơi Ban trưởng nhà giam cũng tham gia.

Chính Sách Tàn Bạo: Chế độ bắt lính hà khắc đến mức người dân phải trốn tránh, khiến nhà cầm quyền phải bắt cả vợ con họ vào tù thay thế.

Sự Đối Xử Khác Biệt: Có sự phân biệt rõ rệt trong cách đối xử giữa các tù nhân, tùy thuộc vào địa vị xã hội và khả năng chi trả.

Bộ Máy Thối Nát: Toàn bộ hệ thống từ trên xuống dưới đều tham nhũng, bất công và thiếu nhân tính.`,
                pageNumber: 6
            },
            {
                id: 'page-7',
                title: 'Triết Lý Về Cuộc Sống và Con Người',
                content: `"Nhật ký trong tù" còn chứa đựng những chiêm nghiệm sâu sắc mang tầm triết lý.

Sự Rèn Luyện Trong Gian Nan: Tác giả nhận ra rằng khó khăn chính là môi trường để tôi luyện con người, giống như gạo phải qua đau đớn khi bị giã mới trở nên trắng trong.

Bản Chất Con Người: Tác giả quan niệm rằng thiện và ác không phải là bản tính sẵn có mà chủ yếu do giáo dục tạo nên. Con người có thể thay đổi và hoàn thiện bản thân qua học tập và rèn luyện.

Giá Trị Của Gian Khổ: Gian khổ không phải là điều tệ hại mà là cơ hội để con người thể hiện bản lĩnh và phẩm chất cao đẹp.

Sức Mạnh Tinh Thần: Tinh thần con người có thể vượt lên trên mọi hoàn cảnh khắc nghiệt, không bị khuất phục bởi khó khăn vật chất.

Ý Nghĩa Cuộc Sống: Cuộc sống có ý nghĩa không phải ở sự sung sướng vật chất mà ở việc cống hiến cho lý tưởng cao đẹp.

Tình Người: Ngay trong hoàn cảnh khắc nghiệt nhất, tình người vẫn tỏa sáng và trở thành nguồn động viên to lớn.`,
                pageNumber: 7
            },
            {
                id: 'page-8',
                title: 'Quan Niệm Về Thơ Ca và Nghệ Thuật',
                content: `Người đến với thơ trong tù ban đầu là để "cho qua ngày dài", "đợi ngày tự do". Tuy nhiên, khi đọc lại thơ xưa, Người đã đưa ra một tuyên ngôn về thơ ca hiện đại, thơ ca cách mạng.

Thơ Ca Như Người Bạn: Trong những ngày tháng cô đơn, thơ ca trở thành người bạn đồng hành, giúp tác giả vượt qua thời gian và không gian giam cầm.

Nghệ Thuật Phản Ánh Hiện Thực: Thơ không chỉ là sự giải trí mà còn là phương tiện để phản ánh hiện thực xã hội một cách chân thực và sâu sắc.

Sức Mạnh Của Lời Thơ: Lời thơ có sức mạnh chữa lành tâm hồn, khích lệ tinh thần và truyền cảm hứng cho người đọc.

Thơ Ca Cách Mạng: Thơ phải gắn liền với cuộc sống, với đấu tranh của nhân dân, không thể tách rời khỏi thực tế xã hội.

Giá Trị Giáo Dục: Thơ ca có vai trò giáo dục, nâng cao nhận thức và tình cảm của con người.

Nghệ Thuật Dân Tộc: Thơ phải mang đậm bản sắc dân tộc, thể hiện tâm hồn và khát vọng của dân tộc.`,
                pageNumber: 8
            },
            {
                id: 'page-9',
                title: 'Tình Yêu Quê Hương và Lý Tưởng Cách Mạng',
                content: `Xuyên suốt tập thơ là tình yêu quê hương da diết và lý tưởng cách mạng bất diệt.

Nỗi Nhớ Quê Hương: Dù ở xa quê hương, trong hoàn cảnh giam cầm, tình yêu đất nước vẫn cháy bỏng trong tim tác giả. Mỗi giấc mơ đều hướng về Tổ quốc.

Trách Nhiệm Với Dân Tộc: Tác giả luôn cảm thấy trách nhiệm nặng nề đối với vận mệnh của dân tộc, lo lắng cho tương lai của đất nước.

Lý Tưởng Độc Lập: Khát vọng giành độc lập cho dân tộc là động lực mạnh mẽ giúp tác giả vượt qua mọi khó khăn.

Niềm Tin Vào Tương Lai: Dù trong hoàn cảnh khắc nghiệt, tác giả vẫn tin tưởng vào một tương lai tươi sáng của đất nước.

Tinh Thần Hy Sinh: Sẵn sàng hy sinh tất cả vì lý tưởng cao đẹp, vì hạnh phúc của nhân dân.

Tình Đoàn Kết: Thể hiện tình đoàn kết với các dân tộc bị áp bức trên thế giới, đặc biệt là nhân dân Trung Quốc.

Ý Chí Đấu Tranh: Ý chí đấu tranh không bao giờ khuất phục, luôn hướng về mục tiêu giải phóng dân tộc.`,
                pageNumber: 9
            },
            {
                id: 'page-10',
                title: 'Kết Luận và Ý Nghĩa Lịch Sử',
                content: `Hành trình hơn một năm tù đày, bắt đầu từ ngày 29-8-1942 và kết thúc vào ngày 10-9-1943, đã được ghi lại một cách sống động và sâu sắc trong "Nhật ký trong tù".

Tượng Đài Tinh Thần: Tác phẩm không chỉ là một biên bản về nỗi thống khổ về vật chất mà còn là một tượng đài về sức mạnh tinh thần. Nó cho thấy một tâm hồn lớn lao, một trí tuệ uyên bác, một trái tim nhân ái và một ý chí cách mạng sắt đá không gì lay chuyển nổi.

Giá Trị Văn Học: Tập thơ thể hiện tài năng văn học xuất chúng của tác giả, với những vần thơ chữ Hán tinh tế, sâu sắc và đầy cảm xúc.

Tài Liệu Lịch Sử: Đây là tài liệu lịch sử quý giá, ghi lại chân thực một giai đoạn quan trọng trong cuộc đời của Chủ tịch Hồ Chí Minh và trong lịch sử dân tộc.

Nguồn Cảm Hứng: Tác phẩm trở thành nguồn cảm hứng bất tận cho các thế hệ sau, khích lệ tinh thần yêu nước và ý chí vượt khó.

Bài Học Nhân Sinh: Những triết lý sâu sắc về cuộc sống, con người và nghệ thuật trong tác phẩm vẫn có giá trị giáo dục to lớn cho đến ngày nay.

Kết Thúc Vinh Quang: Bài thơ cuối cùng đánh dấu sự trở lại với tự do và lòng biết ơn đối với người đã giúp đỡ mình, khép lại một chặng đường gian truân nhưng đầy vinh quang của người chiến sĩ vĩ đại.`,
                pageNumber: 10
            }
        ]
    },
    'tuyen-ngon-doc-lap': {
        id: 'tuyen-ngon-doc-lap',
        title: 'Tuyên Ngôn Độc Lập',
        year: '1945',
        cover: 'https://vnn-imgs-f.vgcloud.vn/2021/09/01/22/tuyen-ngon-1.jpeg?width=0&s=dJ_sMpzdAPkAamKH3kwrpg',
        totalPages: 8,
        readingTime: 45,
        views: 2850,
        likes: 298,
        summary: 'Bản Tuyên ngôn độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa, được đọc tại Quảng trường Ba Đình ngày 2/9/1945.',
        tags: ['Độc lập', 'Lịch sử', 'Chính trị', 'Quốc gia'],
        pages: [
            {
                id: 'page-1',
                title: 'Lời Mở Đầu và Nguyên Tắc Nhân Quyền',
                content: `Hỡi đồng bào cả nước,

"Tất cả mọi người đều sinh ra có quyền bình đẳng. Tạo hóa cho họ những quyền không ai có thể xâm phạm được; trong những quyền ấy, có quyền được sống, quyền tự do và quyền mưu cầu hạnh phúc".

Lời bất hủ ấy ở trong bản Tuyên ngôn độc lập năm 1776 của nước Mỹ. Suy rộng ra, câu ấy có ý nghĩa là: tất cả các dân tộc trên thế giới đều sinh ra bình đẳng; dân tộc nào cũng có quyền sống, quyền sung sướng và quyền tự do.

Bản Tuyên ngôn nhân quyền và dân quyền của Cách mạng Pháp năm 1791 cũng nói:

"Người ta sinh ra tự do và bình đẳng về quyền lợi, và phải luôn luôn được tự do và bình đẳng về quyền lợi".

Đó là những lẽ phải không ai chối cãi được.`,
                pageNumber: 1
            },
            {
                id: 'page-2',
                title: 'Tố Cáo Tội Ác Thực Dân Pháp - Chính Trị',
                content: `Thế mà hơn tám mươi năm nay, bọn thực dân Pháp lợi dụng lá cờ tự do, bình đẳng, bác ái, đến cướp đất nước ta, áp bức đồng bào ta. Hành động của chúng trái hẳn với nhân đạo và chính nghĩa.

Về chính trị, chúng tuyệt đối không cho nhân dân ta một chút tự do dân chủ nào.

Chúng thi hành những luật pháp dã man. Chúng lập ba chế độ khác nhau ở Trung, Nam, Bắc để ngăn cản việc thống nhất nước nhà của ta, để ngăn cản dân tộc ta đoàn kết.

Chúng lập ra nhà tù nhiều hơn trường học. Chúng thẳng tay chém giết những người yêu nước thương nòi của ta. Chúng tắm các cuộc khởi nghĩa của ta trong những bể máu.

Chúng ràng buộc dư luận, thi hành chính sách ngu dân.

Chúng dùng thuốc phiện, rượu cồn để làm cho nòi giống ta suy nhược.`,
                pageNumber: 2
            },
            {
                id: 'page-3',
                title: 'Tố Cáo Tội Ác Thực Dân Pháp - Kinh Tế',
                content: `Về kinh tế, chúng bóc lột dân ta đến tận xương tủy, khiến cho dân ta nghèo nàn, thiếu thốn, nước ta xơ xác, tiêu điều.

Chúng cướp không ruộng đất, hầm mỏ, nguyên liệu.

Chúng giữ độc quyền in giấy bạc, xuất cảng và nhập cảng.

Chúng đặt ra hàng trăm thứ thuế vô lý, làm cho dân ta, nhất là dân cày và dân buôn, trở nên bần cùng.

Chúng không cho các nhà tư sản ta ngóc đầu lên. Chúng bóc lột công nhân ta một cách vô cùng tàn nhẫn.`,
                pageNumber: 3
            },
            {
                id: 'page-4',
                title: 'Thời Kỳ Pháp-Nhật và Nạn Đói 1945',
                content: `Mùa thu năm 1940, phát-xít Nhật đến xâm lăng Đông - Dương để mở thêm căn cứ đánh Đồng minh, thì bọn thực dân Pháp quỳ gối đầu hàng, mở cửa nước ta rước Nhật. Từ đó dân ta chịu hai tầng xiềng xích: Pháp và Nhật. Từ đó dân ta càng cực khổ, nghèo nàn. Kết quả là cuối năm ngoái sang đầu năm nay, từ Quảng trị đến Bắc kỳ hơn hai triệu đồng bào ta bị chết đói.

Ngày 9 tháng 3 năm nay, Nhật tước khí giới của quân đội Pháp. Bọn thực dân Pháp hoặc bỏ chạy hoặc đầu hàng. Thế là chẳng những chúng không "bảo hộ" được ta, trái lại, trong 5 năm, chúng đã bán nước ta hai lần cho Nhật.`,
                pageNumber: 4
            },
            {
                id: 'page-5',
                title: 'Thái Độ Của Việt Minh Với Pháp',
                content: `Trước ngày mồng 9 tháng 3, biết bao lần Việt minh đã kêu gọi người Pháp liên minh để chống Nhật. Bọn thực dân Pháp đã không đáp ứng, lại thẳng tay khủng bố Việt minh hơn nữa.

Thậm chí đến khi thua chạy, chúng còn nhẫn tâm giết nốt số đông tù chính trị ở Yên Bái và Cao Bằng.

Tuy vậy, đối với nước Pháp, đồng bào ta vẫn giữ một thái độ khoan hồng và nhân đạo. Sau cuộc biến động ngày mồng 9 tháng 3, Việt minh đã giúp cho nhiều người Pháp chạy qua biên thùy, lại cứu cho nhiều người Pháp ra khỏi nhà giam Nhật, và bảo vệ tính mạng và tài sản cho họ.`,
                pageNumber: 5
            },
            {
                id: 'page-6',
                title: 'Sự Thật Về Việc Giành Độc Lập',
                content: `Sự thật là từ mùa thu năm 1940, nước ta đã thành thuộc địa của Nhật, chứ không phải thuộc địa của Pháp nữa. Khi Nhật hàng Đồng minh thì nhân dân cả nước ta đã nổi dậy giành chính quyền lập nên nước Việt Nam Dân chủ Cộng hòa.

Sự thật là dân ta đã lấy lại nước Việt Nam từ tay Nhật, chứ không phải từ tay Pháp.

Pháp chạy, Nhật hàng, vua Bảo Đại thoái vị. Dân ta đã đánh đổ các xiềng xích thực dân gần một trăm năm nay để gây dựng nên nước Việt Nam độc lập. Dân ta lại đánh đổ chế độ quân chủ mấy mươi thế kỷ mà lập nên chế độ dân chủ cộng hòa.`,
                pageNumber: 6
            },
            {
                id: 'page-7',
                title: 'Tuyên Bố Độc Lập và Quyết Tâm',
                content: `Bởi thế cho nên, chúng tôi, Lâm thời Chính phủ của nước Việt Nam mới, đại biểu cho toàn dân Việt Nam, tuyên bố thoát ly hẳn quan hệ với Pháp, xóa bỏ hết những hiệp ước mà Pháp đã ký về nước Việt Nam, xóa bỏ tất cả mọi đặc quyền của Pháp trên đất nước Việt Nam.

Toàn dân Việt Nam, trên dưới một lòng, kiên quyết chống lại âm mưu của bọn thực dân Pháp.

Chúng tôi tin rằng các nước Đồng minh đã công nhận những nguyên tắc dân tộc bình đẳng ở các Hội nghị Tê-hê-răng và Cựu-kim-sơn, quyết không thể không công nhận quyền độc lập của dân Việt Nam.

Một dân tộc đã gan góc chống ách nô lệ của Pháp hơn tám mươi năm nay, một dân tộc đã gan góc đứng về phe Đồng minh chống phát-xít mấy năm nay, dân tộc đó phải được tự do ! Dân tộc đó phải được độc lập !`,
                pageNumber: 7
            },
            {
                id: 'page-8',
                title: 'Lời Tuyên Bố Chính Thức',
                content: `Vì những lẽ trên, chúng tôi, Chính phủ Lâm thời của nước Việt Nam Dân chủ Cộng hòa, trịnh trọng tuyên bố với thế giới rằng:

Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập. Toàn thể dân tộc Việt Nam quyết đem tất cả tinh thần và lực lượng, tính mạng và của cải để giữ vững quyền tự do, độc lập ấy.

---

Ngày 2 tháng 9 năm 1945, tại Quảng trường Ba Đình, Hà Nội, trước mặt hàng trăm ngàn đồng bào, Chủ tịch Hồ Chí Minh đã đọc bản Tuyên ngôn độc lập này, chính thức khai sinh ra nước Việt Nam Dân chủ Cộng hòa - tiền thân của nước Cộng hòa xã hội chủ nghĩa Việt Nam ngày nay.

Đây là một trong những văn kiện lịch sử quan trọng nhất của dân tộc Việt Nam, đánh dấu sự kết thúc của gần một thế kỷ đô hộ thực dân và mở ra kỷ nguyên độc lập, tự do cho đất nước.`,
                pageNumber: 8
            }
        ]
    }
}

// Convert reader data to detail format
export const convertToWorkDetail = (readerData: WorkReader): WorkDetail => {
    return {
        id: readerData.id,
        title: readerData.title,
        year: readerData.year,
        summary: readerData.summary,
        cover: readerData.cover,
        tags: readerData.tags,
        content: readerData.pages[0]?.content || '',
        chapters: readerData.pages.map((page, index) => ({
            id: page.id,
            title: page.title,
            content: page.content,
            duration: Math.ceil(page.content.length / 1000) // Estimate reading time
        })),
        readingTime: readerData.readingTime,
        views: readerData.views,
        likes: readerData.likes
    }
}

export const WORKS_DETAIL: Record<string, WorkDetail> = {
    'duong-kach-menh': convertToWorkDetail(WORK_READER_DATA['duong-kach-menh']),
    'ban-an-che-do-thuc-dan-phap': convertToWorkDetail(WORK_READER_DATA['ban-an-che-do-thuc-dan-phap']),
    'nhat-ky-trong-tu': convertToWorkDetail(WORK_READER_DATA['nhat-ky-trong-tu']),
    'tuyen-ngon-doc-lap': convertToWorkDetail(WORK_READER_DATA['tuyen-ngon-doc-lap'])
}
